import type { StringValue } from 'ms'
import type { RedisClient } from '~server/interfaces'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable, Logger } from '@nestjs/common'
import { destr } from 'destr'
import { SharedConfig } from '~server/configs'
import { parseMs } from '~shared/utils'
import { RedisExtendService } from './redis-extend'

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name)
  private readonly keyPrefix = 'cache'
  private readonly ttl: StringValue = '15m'

  constructor(
    @InjectRedis()
    private redisClient: RedisClient,
    private redisExtendService: RedisExtendService,
  ) {}

  async set(key: string, value: number | string, ttl?: number | StringValue) {
    try {
      const parsedKey = this.getKey(key)
      const parsedTTL = typeof ttl === 'number' ? ttl : parseMs('milliseconds', ttl ?? this.ttl)
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
      const keys = await this.redisExtendService.scan(pattern)

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
    return [SharedConfig.appName, this.keyPrefix, key].join(':')
  }
}
