import type { RedisClient } from '~server/interfaces'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable, Logger } from '@nestjs/common'

import { delay } from '~shared/utils'

@Injectable()
export class RedisExtendService {
  private readonly logger = new Logger(RedisExtendService.name)
  /**
   * 每次扫描的键数量
   */
  private readonly batchSize = 1000
  /**
   * 最大扫描键数量
   */
  private readonly maxKeys = 10000
  /**
   * 最大扫描迭代次
   */
  private readonly maxIterations = 100
  /**
   * 每次扫描之间的延迟时间（毫秒）
   */
  private readonly delayBetweenBatches = 0

  constructor(
    @InjectRedis() private redisClient: RedisClient,
  ) {}

  async scan(pattern = '*') {
    try {
      return await this.scanKeys(pattern)
    }
    catch (error) {
      this.logger.error(`SCAN 操作失败: `, error)
      return []
    }
  }

  async page(pattern = '*', page = 1, pageSize = 50) {
    const allKeys = await this.scanKeys(pattern)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    const paginatedKeys = allKeys.slice(startIndex, endIndex)
    const data = await this.getValues(paginatedKeys)

    return {
      data,
      page,
      pageSize,
      total: allKeys.length,
    }
  }

  /**
   * 扫描返回键名数组
   */
  private async scanKeys(pattern: string): Promise<string[]> {
    let cursor = '0'
    const allKeys: string[] = []
    let iterations = 0

    do {
      const [nextCursor, keys] = await this.redisClient.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        this.batchSize,
      )

      cursor = nextCursor
      Array.prototype.push.apply(allKeys, keys)
      iterations++

      if (iterations > this.maxIterations) {
        this.logger.warn(`SCAN 超过最大迭代次数: ${this.maxIterations}`)
        break
      }

      if (allKeys.length >= this.maxKeys) {
        this.logger.warn(`达到最大 keys 数量限制: ${this.maxKeys}`)
        break
      }

      if (this.delayBetweenBatches > 0) {
        await delay(this.delayBetweenBatches)
      }
    } while (cursor !== '0')

    return allKeys
  }

  /**
   * 获取键值对数组
   */
  private async getValues(keys: string[]) {
    if (keys.length === 0) {
      return []
    }

    const pipeline = this.redisClient.pipeline()
    keys.forEach((key) => {
      pipeline.get(key)
      pipeline.ttl(key)
    })

    const results = await pipeline.exec()

    return keys.map((key, index) => {
      const valueResult = results![index * 2]!
      const ttlResult = results![index * 2 + 1]!

      const [valueError, value] = valueResult
      const [ttlError, ttl] = ttlResult

      if (valueError) {
        this.logger.error(`获取键 ${key} 的值失败: ${valueError.message}`)
        return { key, value: null, ttl: -1, error: valueError.message }
      }

      if (ttlError) {
        this.logger.error(`获取键 ${key} 的 TTL 失败: ${ttlError.message}`)
        return { key, value: null, ttl: -1, error: ttlError.message }
      }

      let parsedValue: unknown = value
      if (value) {
        try {
          parsedValue = JSON.parse(value)
        }
        catch {
          // 解析失败，保持原始字符串值
        }
      }

      return { key, value: parsedValue, ttl }
    })
  }
}
