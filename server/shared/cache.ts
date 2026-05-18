import type { StringValue } from 'ms'
import type { ConfigSchema } from '~server/configs'
import type { RedisClient } from '~server/interfaces'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { parseMs } from '~shared/utils'
import { RedisExtendService } from './redis-extend'

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name)
  private readonly cacheKeyPrefix = 'cache'
  private readonly cacheKeySeparator = ':'
  private readonly cacheTTL = '15m'

  constructor(
    @InjectRedis() private redisClient: RedisClient,
    private configService: ConfigService,
    private redisExtendService: RedisExtendService,
  ) {}

  async set(key: string, value: number | string, expire: StringValue = null) {
    try {
      let finalValue = value
      const cacheKey = this.getKey(key)

      if (typeof value === 'object') {
        finalValue = JSON.stringify(value)
      }

      const parsedExpire = parseMs('seconds', expire ?? this.cacheTTL)
      await this.redisClient.setex(cacheKey, parsedExpire, finalValue)
    }
    catch (error) {
      this.logger.error(`缓存设置失败: ${error}`)
    }
  }

  async get(key: string) {
    try {
      const cacheKey = this.getKey(key)
      const value = await this.redisClient.get(cacheKey)
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
      this.logger.error(`缓存缓存失败: ${error}`)
    }
  }

  async delete(key: string) {
    try {
      const cacheKey = this.getKey(key)
      await this.redisClient.del(cacheKey)
    }
    catch (error) {
      this.logger.error(`删除缓存失败: ${error}`)
    }
  }

  async deleteMany(keys: string[]) {
    try {
      if (!Array.isArray(keys) || keys.length === 0) {
        return
      }

      const cacheKeys = keys.map(key => this.getKey(key))

      await this.redisClient.del(...cacheKeys)
    }
    catch (error) {
      this.logger.error(`删除多个缓存失败: ${error}`)
    }
  }

  async clear() {
    try {
      const pattern = this.getKey('*')
      const keys = await this.redisExtendService.scan(pattern)

      if (keys.length === 0) {
        return
      }

      await this.redisClient.del(...keys)
    }
    catch (error) {
      this.logger.error(`清空缓存失败: ${error}`)
    }
  }

  getKey(key: string) {
    return [this.configService.get<ConfigSchema['appName']>('appName'), this.cacheKeyPrefix, key].join(this.cacheKeySeparator)
  }
}
