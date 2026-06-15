import type { CacheModuleOptions } from '@nestjs/cache-manager'
import type { ConfigType } from '@nestjs/config'
import KeyvRedis from '@keyv/redis'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { getRedisUrl } from '~server/utils'
import { SharedConfig } from './shared'

export const CacheConfig = registerAs('cache', () => {
  return match(APP_ENV)
    .returnType<Omit<CacheModuleOptions, 'isGlobal'>>()
    .with(AppEnvEnum.DEV, () => ({
      nonBlocking: true,
      stores: [
        new KeyvRedis(getRedisUrl(SharedConfig.redis)),
      ],
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type ICacheConfig = ConfigType<typeof CacheConfig>
