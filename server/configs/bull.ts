import type { BullRootModuleOptions } from '@nestjs/bullmq'
import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { SharedConfig } from './shared'

export const BullConfig = registerAs('bull', () => {
  const { appName, redis } = SharedConfig
  return match(APP_ENV)
    .returnType<BullRootModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({
      prefix: [appName, 'bull'].join(':'),
      connection: {
        ...redis,
      },
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type IBullConfig = ConfigType<typeof BullConfig>
