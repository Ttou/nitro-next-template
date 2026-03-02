import type { StringValue } from 'ms'
import type { ConfigSchema } from '~server/app/configs'
import type { RedisClient } from '~server/app/extends'
import type { CacheModuleOptions } from './interface'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { REDIS_CLIENT, RedisScannerService } from '~server/app/extends'
import { parseMs } from '~shared/utils'
import { defaultOptions } from './constant'
import { CACHE_MODULE_OPTIONS } from './module-define'

@Injectable()
export class CacheService {
  private logger = new Logger(CacheService.name)

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
    @Inject(CACHE_MODULE_OPTIONS) private readonly cacheModuleOptions: CacheModuleOptions,
    private readonly redisScannerService: RedisScannerService,
    private readonly configService: ConfigService,
  ) {}

  async set(key: string, value: number | string, expire: StringValue = null) {
    try {
      let finalValue = value
      const cacheKey = this.getCacheKey(key)

      if (typeof value === 'object') {
        finalValue = JSON.stringify(value)
      }

      const parsedExpire = parseMs('seconds', expire ?? this.ttl)
      await this.redisClient.setex(cacheKey, parsedExpire, finalValue)
    }
    catch (error) {
      console.error(`缓存设置失败: ${error}`, { 0: CacheService.name })
    }
  }

  async get(key: string) {
    try {
      const cacheKey = this.getCacheKey(key)
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
      const cacheKey = this.getCacheKey(key)
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

      const cacheKeys = keys.map(key => this.getCacheKey(key))

      await this.redisClient.del(...cacheKeys)
    }
    catch (error) {
      this.logger.error(`删除多个缓存失败: ${error}`)
    }
  }

  async clear() {
    try {
      const pattern = this.getCacheKey('*')
      const keys = await this.redisScannerService.scan(pattern)

      if (keys.length === 0) {
        return
      }

      await this.redisClient.del(...keys)
    }
    catch (error) {
      this.logger.error(`清空缓存失败: ${error}`)
    }
  }

  private get options() {
    return {
      ...defaultOptions,
      ...this.cacheModuleOptions,
    }
  }

  private getCacheKey(key: string) {
    return [this.configService.get<ConfigSchema['appName']>('appName'), this.options.keyPrefix, key].join(this.options.keyPrefixSeparator)
  }
}
