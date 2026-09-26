import type { ConfigType } from '@nestjs/config'
import type { CacheModuleOptions } from '~nestjs-modules/cache'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { SharedConfig } from './shared'

export const CacheConfig = registerAs('cache', () => {
  const { appName } = SharedConfig
  return match(APP_ENV)
    .returnType<CacheModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({
      keyPrefix: [appName, 'cache'].join(':'),
      expire: '15m',
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type ICacheConfig = ConfigType<typeof CacheConfig>
