import type { Redis } from 'ioredis'
import type { StringValue } from 'ms'
import type { CacheModuleOptions } from './interface'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { destr } from 'destr'
import { parseMs } from '~shared/utils'
import { CACHE_REDIS, defaultOptions } from './constant'
import { MODULE_OPTIONS_TOKEN } from './module-define'
// eslint-disable-next-line ts/consistent-type-imports
import { CacheRedisExtendService } from './redis-extend'

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name)
  private options: CacheModuleOptions

  constructor(
    @Inject(CACHE_REDIS) private redisClient: Redis,
    @Inject(MODULE_OPTIONS_TOKEN) private moduleOptions: CacheModuleOptions,
    private cacheRedisExtendService: CacheRedisExtendService,
  ) {
    this.options = Object.assign({}, defaultOptions, this.moduleOptions)
  }

  async set(key: string, value: number | string, expire?: number | StringValue) {
    try {
      const parsedKey = this.getKey(key)
      const parsedTTL = typeof expire === 'number' ? expire : parseMs('milliseconds', expire ?? this.options.expire!)
      const parsedValue = JSON.stringify(value)
      await this.redisClient.setex(parsedKey, parsedTTL, parsedValue)
    }
    catch (error) {
      this.logger.error(`缓存设置失败: ${error}`)
    }
  }

  async get<T>(key: string) {
    try {
      const parsedKey = this.getKey(key)
      const value = await this.redisClient.get(parsedKey)
      return destr<T>(value)
    }
    catch (error) {
      this.logger.error(`缓存缓存失败: ${error}`)
      return null
    }
  }

  async delete(key: string) {
    try {
      const parsedKey = this.getKey(key)
      await this.redisClient.del(parsedKey)
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
      await this.redisClient.unlink(parsedKeys)
    }
    catch (error) {
      this.logger.error(`删除多个缓存失败: ${error}`)
    }
  }

  async clear() {
    try {
      const pattern = this.getKey('*')
      const keys = await this.cacheRedisExtendService.scan(pattern)

      if (keys.length === 0) {
        return
      }

      await this.redisClient.unlink(keys)
    }
    catch (error) {
      this.logger.error(`清空缓存失败: ${error}`)
    }
  }

  getKey(key: string) {
    return [this.options.keyPrefix!, key].join(':')
  }
}
