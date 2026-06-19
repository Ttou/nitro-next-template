import type { ConfigType } from '@nestjs/config'
import type { XltTokenModuleOptions } from '@xlt-token/nestjs'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'

export const XltTokenConfig = registerAs('xlt-token', () => {
  return match(APP_ENV)
    .returnType<XltTokenModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({
      config: {
        timeout: '7d',
        jwt: {
          secret: '$2b$10$nxi79AIrqNBKgNVTcBnvQu==',
          algorithm: 'HS256',
          issuer: 'xlt-token',
        },
      },
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type IXltTokenConfig = ConfigType<typeof XltTokenConfig>
