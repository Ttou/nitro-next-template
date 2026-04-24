import type { FactoryProvider } from '@nestjs/common'
import type { RedisModuleOptions } from './interface'
import { Logger } from '@nestjs/common'
import { Redis } from 'ioredis'
import { REDIS_CLIENT } from './constant'
import { REDIS_MODULE_OPTIONS } from './module-define'

export const RedisProvider: FactoryProvider = {
  provide: REDIS_CLIENT,
  useFactory: async (options: RedisModuleOptions) => {
    const logger = new Logger('RedisModule')

    const redisClient = new Redis({
      ...options,
      lazyConnect: true,
    })

    await redisClient.connect()

    redisClient.on('close', () => {
      logger.log('Redis client closed')
    })

    redisClient.on('end', () => {
      logger.log('Redis client connection ended')
    })

    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err)
    })

    const redisUrl = `redis://${options.host}:${options.port}/${options.db ?? 0}`
    logger.log(`Redis client connected to ${redisUrl}`)

    return redisClient
  },
  inject: [REDIS_MODULE_OPTIONS],
}
