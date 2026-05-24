import type { StringValue } from 'ms'
import type { ConfigSchema } from '~server/configs'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common'
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    private redisExtendService: RedisExtendService,
  ) {}

  async set(key: string, value: number | string, ttl?: number | StringValue) {
    try {
      const parsedKey = this.getKey(key)
      const parsedTTL = typeof ttl === 'number' ? ttl : parseMs('milliseconds', ttl ?? this.cacheTTL)
      await this.cacheManager.set(parsedKey, value, parsedTTL)
    }
    catch (error) {
      this.logger.error(`缓存设置失败: ${error}`)
    }
  }

  async get<T>(key: string) {
    try {
      const parsedKey = this.getKey(key)
      return await this.cacheManager.get<T>(parsedKey)
    }
    catch (error) {
      this.logger.error(`缓存缓存失败: ${error}`)
      return null
    }
  }

  async delete(key: string) {
    try {
      const parsedKey = this.getKey(key)
      await this.cacheManager.del(parsedKey)
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

      const parsedKeys = keys.map(key => this.getKey(key))
      await this.cacheManager.mdel(parsedKeys)
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

      await this.cacheManager.mdel(keys)
    }
    catch (error) {
      this.logger.error(`清空缓存失败: ${error}`)
    }
  }

  getKey(key: string) {
    return [this.configService.get<ConfigSchema['appName']>('appName'), this.cacheKeyPrefix, key].join(this.cacheKeySeparator)
  }
}
