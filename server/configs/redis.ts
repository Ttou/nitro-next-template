import type { RedisModuleOptions } from '@nestjs-modules/ioredis'
import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { SharedConfig } from './shared'

export const RedisConfig = registerAs('redis', () => {
  return match(APP_ENV)
    .returnType<RedisModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({
      type: 'single',
      options: {
        ...SharedConfig.redis,
      },
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type IRedisConfig = ConfigType<typeof RedisConfig>
