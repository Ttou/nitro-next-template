import type { IRedisScannerOptions, RedisClient } from './interface'
import { Inject, Injectable } from '@nestjs/common'
import { delay } from '~shared/utils'

import { LoggerService } from '../logger'
import { REDIS_CLIENT, redisScannerDefaultOptions } from './constant'

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private redisClient: RedisClient,
    private loggerService: LoggerService,
  ) {
    this.loggerService.setContext(RedisService.name)
  }

  /**
   * 扫描返回键名数组
   */
  async scan(pattern = '*', options: IRedisScannerOptions = {}) {
    const config = { ...redisScannerDefaultOptions, ...options }
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
        allKeys.push(...keys)
        iterations++

        if (iterations > config.maxIterations!) {
          this.loggerService.warn(`SCAN 超过最大迭代次数: ${config.maxIterations}`)
          break
        }

        if (allKeys.length >= config.maxKeys!) {
          this.loggerService.warn(`达到最大 keys 数量限制: ${config.maxKeys}`)
          break
        }

        if (config.delayBetweenBatches! > 0) {
          await delay(config.delayBetweenBatches!)
        }
      } while (cursor !== '0')

      return allKeys
    }
    catch (error) {
      this.loggerService.error(`SCAN 操作失败: `, error)
      return []
    }
  }

  /**
   * 扫描返回键值对数组
   * @param pattern
   * @param options
   */
  async scanWithValues(pattern = '*', options: IRedisScannerOptions = {}) {
    const keys = await this.scan(pattern, options)

    return await this.getValues(keys)
  }

  /**
   * 分页扫描
   */
  async page(pattern = '*', page = 1, pageSize = 50, options: IRedisScannerOptions = {}) {
    const config = { ...redisScannerDefaultOptions, ...options }
    let cursor = '0'
    const allKeys = []
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
      allKeys.push(...keys)
      iterations++

      // 安全检查
      if (iterations > config.maxIterations!) {
        this.loggerService.warn(`SCAN 超过最大迭代次数: ${config.maxIterations}`)
        break
      }

      if (allKeys.length >= config.maxKeys!) {
        this.loggerService.warn(`达到最大 keys 数量限制: ${config.maxKeys}`)
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
        this.loggerService.error(`获取键 ${key} 的值失败: ${valueError.message}`)
        return { key, value: null, ttl: -1, error: valueError.message }
      }

      if (ttlError) {
        this.loggerService.error(`获取键 ${key} 的 TTL 失败: ${ttlError.message}`)
        return { key, value: null, ttl: -1, error: ttlError.message }
      }

      let parsedValue = value
      try {
        if (value) {
          parsedValue = JSON.parse(value)
        }
      }
      catch {
      }

      return { key, value: parsedValue, ttl }
    })
  }
}
