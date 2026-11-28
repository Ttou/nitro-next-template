import type { OnApplicationBootstrap } from '@nestjs/common'
import type { Queue } from 'bullmq'
import type { IConfig } from '~server/configs'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { parseMs } from '~shared/utils'
import { QueueNameEnum } from './queues.constant'

/**
 * 调度器 ID
 *
 * `upsertJobScheduler` 按 ID 覆盖，多实例部署或重启都不会叠加出重复任务。
 */
const SCHEDULER_ID = 'storage-orphan-sweep'

/**
 * 注册孤儿文件清理的定时任务
 *
 * 只在 STORAGE_CLEANUP_ENABLED=true 时注册；间隔取 STORAGE_CLEANUP_EVERY（默认 1d）。
 */
@Injectable()
export class StorageOrphanScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(StorageOrphanScheduler.name)

  constructor(
    @InjectQueue(QueueNameEnum.STORAGE_ORPHAN) private readonly queue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const { enabled, every, retentionDays, dryRun } = this.configService
      .getOrThrow<IConfig['storage-cleanup']>('storage-cleanup')

    if (!enabled) {
      // 调度器存在 Redis 里，关掉开关后不会自动消失，这里顺手清掉遗留的排期
      const removed = await this.queue.removeJobScheduler(SCHEDULER_ID)

      this.logger.log(
        removed
          ? '孤儿文件清理未启用，已移除遗留的定时任务'
          : '孤儿文件清理未启用，跳过定时任务注册',
      )
      return
    }

    await this.queue.upsertJobScheduler(
      SCHEDULER_ID,
      {
        every: parseMs('milliseconds', every),
      },
      {
        name: 'sweep',
      },
    )

    this.logger.log(
      `孤儿文件清理已注册：每 ${every} 执行一次，保留 ${retentionDays} 天，${dryRun ? 'dryRun（只统计不删除）' : '将实际删除'}`,
    )
  }
}
