import type { FactoryProvider } from '@nestjs/common'
import type { RedisModuleOptions } from './interface'
import { Redis } from 'ioredis'
import { colorGreen } from '~server/utils'
import { LoggerService } from '../logger'
import { REDIS_CLIENT } from './constant'
import { REDIS_MODULE_OPTIONS } from './module-define'

export const RedisProvider: FactoryProvider = {
  provide: REDIS_CLIENT,
  useFactory: async (options: RedisModuleOptions, loggerService: LoggerService) => {
    loggerService.setContext('RedisModule')

    const redisClient = new Redis({
      ...options,
      lazyConnect: true,
    })

    await redisClient.connect()

    const redisUrl = colorGreen(`redis://${options.host}:${options.port}/${options.db ?? 0}`)
    loggerService.log(`Redis client connected to ${redisUrl}`)

    return redisClient
  },
  inject: [REDIS_MODULE_OPTIONS, LoggerService],
}
