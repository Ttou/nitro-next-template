import type { ConfigType } from '@nestjs/config'
import type { FormDataInterceptorConfig } from 'nestjs-form-data'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'

export const FormDataConfig = registerAs('form-data', () => {
  return match(APP_ENV)
    .returnType<FormDataInterceptorConfig>()
    .with(AppEnvEnum.DEV, () => ({
      fileSystemStoragePath: './uploads',
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type IFormDataConfig = ConfigType<typeof FormDataConfig>
