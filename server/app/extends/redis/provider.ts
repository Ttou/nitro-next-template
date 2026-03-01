import type { FactoryProvider } from '@nestjs/common'
import type { RedisModuleOptions } from './interface'
import { Logger } from '@nestjs/common'
import { Redis } from 'ioredis'
import { colorGreen } from '~shared/utils'
import { REDIS } from './constant'
import { REDIS_MODULE_OPTIONS } from './module-define'

export const RedisProvider: FactoryProvider = {
  provide: REDIS,
  useFactory: async (options: RedisModuleOptions) => {
    const logger = new Logger('RedisModule')
    const redisClient = new Redis({
      ...options,
      lazyConnect: true,
    })

    await redisClient.connect()

    const redisUrl = colorGreen(`redis://${options.host}:${options.port}/${options.db ?? 0}`)
    logger.log(`Redis client connected to ${redisUrl}`)

    return redisClient
  },
  inject: [REDIS_MODULE_OPTIONS],
}
