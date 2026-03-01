import type { RedisClient } from '../extends'
import { Inject, Injectable } from '@nestjs/common'
import { delay } from '~shared/utils'
import { REDIS } from '../extends'

interface IRedisScannerOptions {
  batchSize?: number
  maxKeys?: number
  maxIterations?: number
  delayBetweenBatches?: number
}

@Injectable()
export class RedisScanner {
  private readonly defaultOptions: IRedisScannerOptions = {
    batchSize: 100,
    maxKeys: 10000,
    maxIterations: 1000,
    delayBetweenBatches: 0,
  }

  constructor(
    @Inject(REDIS) private readonly redis: RedisClient,
  ) {}

  /**
   * 扫描返回键名数组
   */
  async scan(pattern = '*', options: IRedisScannerOptions = {}) {
    const config = { ...this.defaultOptions, ...options }
    let cursor = '0'
    const allKeys = []
    let iterations = 0

    try {
      do {
        const [nextCursor, keys] = await this.redis.scan(
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
          console.warn(`SCAN 超过最大迭代次数: ${config.maxIterations}`)
          break
        }

        if (allKeys.length >= config.maxKeys!) {
          console.warn(`达到最大 keys 数量限制: ${config.maxKeys}`)
          break
        }

        // 批次间延迟
        if (config.delayBetweenBatches! > 0) {
          await delay(config.delayBetweenBatches!)
        }
      } while (cursor !== '0')

      return allKeys
    }
    catch (error) {
      console.error('SCAN 操作失败:', error)
      throw error
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
    const config = { ...this.defaultOptions, ...options }
    let cursor = '0'
    const allKeys = []
    let iterations = 0
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    // 扫描直到收集到足够的分页数据
    do {
      const [nextCursor, keys] = await this.redis.scan(
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
        console.warn(`SCAN 超过最大迭代次数: ${config.maxIterations}`)
        break
      }

      if (allKeys.length >= config.maxKeys!) {
        console.warn(`达到最大 keys 数量限制: ${config.maxKeys}`)
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

    // 批量获取值
    const pipeline = this.redis.pipeline()
    keys.forEach(key => pipeline.get(key))

    const results = await pipeline.exec()

    return keys.map((key, index) => {
      const [error, value] = results![index]!
      if (error) {
        console.error(`获取键 ${key} 的值失败:`, error)
        return { key, value: null, error: error.message }
      }

      // 尝试解析 JSON
      let parsedValue = value
      try {
        if (value) {
          parsedValue = JSON.parse(value)
        }
      }
      catch {
        // 保持原始值
      }

      return { key, value: parsedValue }
    })
  }
}
