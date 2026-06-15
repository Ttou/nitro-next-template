import type { ConfigType } from '@nestjs/config'
import type { ClsModuleFactoryOptions } from 'nestjs-cls'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'

export const ClsConfig = registerAs('cls', () => {
  return match(APP_ENV)
    .returnType<ClsModuleFactoryOptions>()
    .with(AppEnvEnum.DEV, () => ({
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: req => req.id,
      },
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type IClsConfig = ConfigType<typeof ClsConfig>
