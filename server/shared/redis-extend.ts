import type { RedisClient } from '~server/interfaces'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable, Logger } from '@nestjs/common'

import { delay } from '~shared/utils'

interface IRedisScannerOptions {
  /**
   * 每次扫描的键数量
   * @default 1000
   */
  batchSize?: number
  /**
   * 最大扫描键数量
   * @default 10000
   */
  maxKeys?: number
  /**
   * 最大扫描迭代次数
   * @default 100
   */
  maxIterations?: number
  /**
   * 每次扫描之间的延迟时间（毫秒）
   * @default 0
   */
  delayBetweenBatches?: number
}

@Injectable()
export class RedisExtendService {
  private readonly logger = new Logger(RedisExtendService.name)
  private readonly redisScannerOptions: IRedisScannerOptions = {
    batchSize: 1000,
    maxIterations: 100,
    maxKeys: 10000,
    delayBetweenBatches: 0,
  }

  constructor(
    @InjectRedis() private redisClient: RedisClient,
  ) {}

  /**
   * 扫描返回键名数组
   */
  async scan(pattern = '*', options: IRedisScannerOptions = {}) {
    const config = { ...this.redisScannerOptions, ...options }
    let cursor = '0'
    const allKeys: string[] = []
    let iterations = 0

    try {
      do {
        const [nextCursor, keys] = await this.redisClient.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          config.batchSize!,
        )

        cursor = nextCursor
        // 使用 apply 代替展开运算符，避免 O(n²) 复杂度
        Array.prototype.push.apply(allKeys, keys)
        iterations++

        if (iterations > config.maxIterations!) {
          this.logger.warn(`SCAN 超过最大迭代次数: ${config.maxIterations}`)
          break
        }

        if (allKeys.length >= config.maxKeys!) {
          this.logger.warn(`达到最大 keys 数量限制: ${config.maxKeys}`)
          break
        }

        if (config.delayBetweenBatches! > 0) {
          await delay(config.delayBetweenBatches!)
        }
      } while (cursor !== '0')

      return allKeys
    }
    catch (error) {
      this.logger.error(`SCAN 操作失败: `, error)
      return []
    }
  }

  /**
   * 扫描返回键值对数组
   * @param pattern
   * @param options
   */
  async scanWithValues(pattern = '*', options: IRedisScannerOptions = {}) {
    const config = { ...this.redisScannerOptions, ...options }
    let cursor = '0'
    const results: Array<{ key: string, value: unknown, ttl: number }> = []
    let iterations = 0

    try {
      do {
        const [nextCursor, keys] = await this.redisClient.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          config.batchSize!,
        )

        cursor = nextCursor
        iterations++

        // 边扫描边获取值，避免二次遍历
        if (keys.length > 0) {
          const values = await this.getValues(keys)
          Array.prototype.push.apply(results, values)
        }

        if (iterations > config.maxIterations!) {
          this.logger.warn(`SCAN 超过最大迭代次数: ${config.maxIterations}`)
          break
        }

        if (results.length >= config.maxKeys!) {
          this.logger.warn(`达到最大 keys 数量限制: ${config.maxKeys}`)
          break
        }

        if (config.delayBetweenBatches! > 0) {
          await delay(config.delayBetweenBatches!)
        }
      } while (cursor !== '0')

      return results
    }
    catch (error) {
      this.logger.error(`SCAN 操作失败: `, error)
      return []
    }
  }

  /**
   * 分页扫描
   */
  async page(pattern = '*', page = 1, pageSize = 50, options: IRedisScannerOptions = {}) {
    const config = { ...this.redisScannerOptions, ...options }
    let cursor = '0'
    const allKeys: string[] = []
    let iterations = 0
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    // 扫描直到收集到足够的分页数据
    do {
      const [nextCursor, keys] = await this.redisClient.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        config.batchSize!,
      )

      cursor = nextCursor
      // 使用 apply 代替展开运算符，避免 O(n²) 复杂度
      Array.prototype.push.apply(allKeys, keys)
      iterations++

      // 安全检查
      if (iterations > config.maxIterations!) {
        this.logger.warn(`SCAN 超过最大迭代次数: ${config.maxIterations}`)
        break
      }

      if (allKeys.length >= config.maxKeys!) {
        this.logger.warn(`达到最大 keys 数量限制: ${config.maxKeys}`)
        break
      }
    } while (cursor !== '0' && allKeys.length < endIndex)

    // 内存分页
    const paginatedKeys = allKeys.slice(startIndex, endIndex)
    const total = allKeys.length
    const data = await this.getValues(paginatedKeys)

    return {
      data,
      page,
      pageSize,
      total,
    }
  }

  /**
   * 获取键值对数组
   * @param keys
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
