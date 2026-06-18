import type { RedisClient } from '~server/interfaces'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class RedisExtendService {
  private readonly logger = new Logger(RedisExtendService.name)

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

    do {
      const [nextCursor, keys] = await this.redisClient.scan(
        cursor,
        'MATCH',
        pattern,
      )

      cursor = nextCursor
      allKeys.push(...keys)
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
      const [, value] = results![index * 2]!
      const [, ttl] = results![index * 2 + 1]!

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
