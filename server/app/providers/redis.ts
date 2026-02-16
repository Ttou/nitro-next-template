import type { FactoryProvider } from '@nestjs/common'
import type { ConfigSchema } from '../configs'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { logger } from '../loggers'

export const REDIS = Symbol('redis')

export type { Redis }

export const RedisProvider: FactoryProvider = {
  provide: REDIS,
  useFactory: async (configService: ConfigService) => {
    const redisConfig = configService.get<ConfigSchema['redis']>('redis')

    const instance = new Redis({
      ...redisConfig,
      lazyConnect: true,
    })

    await instance.connect()

    logger.info('Redis initialized', { 0: 'RedisProvider' })

    return instance
  },
  inject: [ConfigService],
}
