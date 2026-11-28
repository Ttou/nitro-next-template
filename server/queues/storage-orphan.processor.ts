import type { Job } from 'bullmq'
import type { IConfig } from '~server/configs'
import { EntityManager } from '@mikro-orm/mysql'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { chunk } from 'es-toolkit'
import { SysStorageFileEntity } from '~db/entities'
import { s3Disk } from '~server/configs'
import { isManagedStorageKey } from '~server/constants'
import { QueueNameEnum } from './queues.constant'

/** 单次 DeleteObjects 上限，S3 协议限制 */
const DELETE_BATCH_SIZE = 1000
/** 数据库分页扫描的页长 */
const RECORD_PAGE_SIZE = 500
const DAY_IN_MS = 24 * 60 * 60 * 1000

export interface StorageOrphanSweepResult {
  dryRun: boolean
  retentionDays: number
  scannedObjects: number
  scannedRecords: number
  /** 键不符合统一格式、不参与对账的记录数 */
  unmanagedRecords: number
  orphanObjects: number
  danglingRecords: number
  deletedObjects: number
  deletedRecords: number
}

/**
 * 孤儿文件清理
 *
 * 双向比对存储与数据库：
 * - 对象存在、库里没记录 → 上传中途失败或记录被误删，删对象
 * - 库里有记录、对象不存在 → 对象被外部清理，删记录
 *
 * 两类都只处理早于保留期的数据，给「上传完成但业务还没落引用」留缓冲。
 * 支持 dryRun：默认只统计不删除。
 */
@Processor(QueueNameEnum.STORAGE_ORPHAN, { concurrency: 1 })
export class StorageOrphanProcessor extends WorkerHost {
  private readonly logger = new Logger(StorageOrphanProcessor.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly em: EntityManager,
  ) {
    super()
  }

  async process(_job: Job): Promise<StorageOrphanSweepResult | undefined> {
    const { enabled, retentionDays, dryRun } = this.configService
      .getOrThrow<IConfig['storage-cleanup']>('storage-cleanup')

    // bull-ui 里可以手动触发，未启用时也要守住
    if (!enabled) {
      this.logger.warn('孤儿文件清理未启用（STORAGE_CLEANUP_ENABLED），跳过本次执行')
      return
    }

    const cutoff = new Date(Date.now() - retentionDays * DAY_IN_MS)

    // #region 存储侧索引：key -> lastModified
    const objects = new Map<string, Date>()
    for await (const entry of s3Disk.listAll()) {
      // 只处理上传接口产出的键，桶里其他数据不参与对账
      if (!isManagedStorageKey(entry.key)) {
        continue
      }
      objects.set(entry.key, entry.lastModified)
    }
    // #endregion

    // #region 数据库侧分页扫描，只保留 key 集合与候选 id，避免整表进内存
    const em = this.em.fork()
    const recordKeys = new Set<string>()
    const danglingIds: string[] = []
    let scannedRecords = 0
    let unmanagedRecords = 0

    for (let offset = 0; ; offset += RECORD_PAGE_SIZE) {
      const records = await em.find(SysStorageFileEntity, {}, {
        fields: ['id', 'key', 'createdAt'],
        limit: RECORD_PAGE_SIZE,
        offset,
        orderBy: { createdAt: 'ASC' },
      })

      if (records.length === 0) {
        break
      }

      scannedRecords += records.length

      for (const record of records) {
        // 键不符合统一格式（历史数据或外部写入）不参与对账：
        // 这类对象不在上面的索引里，按「悬挂记录」处理会删掉记录却把对象留在桶里
        if (!isManagedStorageKey(record.key)) {
          unmanagedRecords += 1
          continue
        }

        recordKeys.add(record.key)

        // 对象不在了，且记录早于保留期，才算悬挂记录
        if (!objects.has(record.key) && record.createdAt < cutoff) {
          danglingIds.push(record.id)
        }
      }

      if (records.length < RECORD_PAGE_SIZE) {
        break
      }
    }
    // #endregion

    // 安全阀：库里有记录却一个对象都列不出来，多半是 bucket / 前缀配错，
    // 此时继续删记录会把正常数据清空
    if (scannedRecords > 0 && objects.size === 0) {
      throw new Error('存储侧未列出任何对象，疑似 S3 bucket / 前缀配置错误，已中止清理')
    }

    // #region 双向比对
    const orphanKeys = [...objects]
      .filter(([key, lastModified]) => !recordKeys.has(key) && lastModified < cutoff)
      .map(([key]) => key)

    const result: StorageOrphanSweepResult = {
      dryRun,
      retentionDays,
      scannedObjects: objects.size,
      scannedRecords,
      unmanagedRecords,
      orphanObjects: orphanKeys.length,
      danglingRecords: danglingIds.length,
      deletedObjects: 0,
      deletedRecords: 0,
    }
    // #endregion

    if (dryRun) {
      const samples = orphanKeys.slice(0, 5)
      this.logger.log(`[dryRun] ${JSON.stringify(result)}${samples.length > 0
        ? `，示例 key：${samples.join(', ')}`
        : ''}`)
      return result
    }

    // 先删对象再删记录：即使中途失败，留下的也是「有记录无对象」，下一轮仍可自愈
    for (const keys of chunk(orphanKeys, DELETE_BATCH_SIZE)) {
      await s3Disk.delete(keys)
      result.deletedObjects += keys.length
    }

    for (const ids of chunk(danglingIds, DELETE_BATCH_SIZE)) {
      result.deletedRecords += await em.nativeDelete(SysStorageFileEntity, {
        id: { $in: ids },
      })
    }

    this.logger.log(`清理完成：${JSON.stringify(result)}`)

    return result
  }
}
