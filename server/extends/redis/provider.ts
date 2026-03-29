import type { FactoryProvider } from '@nestjs/common'
import type { RedisModuleOptions } from './interface'
import { colorize, LOG_COLORS } from '@tsed/logger'
import { Redis } from 'ioredis'
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

    redisClient.on('close', () => {
      loggerService.log('Redis client closed')
    })

    redisClient.on('end', () => {
      loggerService.log('Redis client connection ended')
    })

    redisClient.on('error', (err) => {
      loggerService.error('Redis client error:', err)
    })

    const redisUrl = colorize(`redis://${options.host}:${options.port}/${options.db ?? 0}`, LOG_COLORS.DEBUG)
    loggerService.log(`Redis client connected to ${redisUrl}`)

    return redisClient
  },
  inject: [REDIS_MODULE_OPTIONS, LoggerService],
}
