import type { StringValue } from 'ms'
import type { ConfigSchema } from '../configs'
import type { Redis } from '../providers'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { parseMs } from '~shared/utils'
import { logger } from '../loggers'
import { REDIS } from '../providers'
import { RedisScanner } from './redis-scanner'

@Injectable()
export class CacheService {
  private readonly keyPrefix = 'cache'
  private readonly keyPrefixSeparator = ':'

  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    private readonly redisScanner: RedisScanner,
    private readonly configService: ConfigService,
  ) {}

  async set(key: string, value: number | string, expire: StringValue = null) {
    try {
      let finalValue = value
      const cacheKey = this.getCacheKey(key)

      if (typeof value === 'object') {
        finalValue = JSON.stringify(value)
      }

      if (expire) {
        const parsedExpire = parseMs('seconds', expire)
        await this.redis.setex(cacheKey, parsedExpire, finalValue)
      }
      else {
        await this.redis.set(cacheKey, finalValue)
      }
    }
    catch (error) {
      console.error(`缓存设置失败: ${error}`, { 0: CacheService.name })
    }
  }

  async get(key: string) {
    try {
      const cacheKey = this.getCacheKey(key)
      const value = await this.redis.get(cacheKey)
      if (!value)
        return null

      // 尝试解析 JSON
      try {
        return JSON.parse(value)
      }
      catch {
        return value
      }
    }
    catch (error) {
      logger.error(`缓存缓存失败: ${error}`, { 0: CacheService.name })
    }
  }

  async delete(key: string) {
    try {
      const cacheKey = this.getCacheKey(key)
      await this.redis.del(cacheKey)
    }
    catch (error) {
      logger.error(`删除缓存失败: ${error}`, { 0: CacheService.name })
    }
  }

  async deleteMany(keys: string[]) {
    try {
      if (!Array.isArray(keys) || keys.length === 0) {
        return
      }

      const cacheKeys = keys.map(key => this.getCacheKey(key))

      await this.redis.del(...cacheKeys)
    }
    catch (error) {
      logger.error(`删除多个缓存失败: ${error}`, { 0: CacheService.name })
    }
  }

  async clear() {
    try {
      const pattern = this.getCacheKey('*')
      const keys = await this.redisScanner.scan(pattern)

      if (keys.length === 0) {
        return
      }

      await this.redis.del(...keys)
    }
    catch (error) {
      logger.error(`清空缓存失败: ${error}`, { 0: CacheService.name })
    }
  }

  private getCacheKey(key: string) {
    return `${this.configService.get<ConfigSchema['appName']>('appName')}${this.keyPrefixSeparator}${this.keyPrefix}${this.keyPrefixSeparator}${key}`
  }
}
