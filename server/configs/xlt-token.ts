import type { ConfigType } from '@nestjs/config'
import type { XltTokenModuleOptions } from '@xlt-token/nestjs'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { CustomXltStp } from '~server/customs'

export const XltTokenConfig = registerAs('xlt-token', () => {
  return match(APP_ENV)
    .returnType<XltTokenModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({
      config: {
        defaultCheck: true,
        isReadHeader: true,
        timeout: '7d',
        jwt: {
          secret: '$2b$10$nxi79AIrqNBKgNVTcBnvQu==',
          algorithm: 'HS256',
          issuer: 'xlt-token',
        },
      },
      stpInterface: CustomXltStp,
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type IXltTokenConfig = ConfigType<typeof XltTokenConfig>
