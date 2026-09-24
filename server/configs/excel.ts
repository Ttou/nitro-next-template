import type { ConfigType } from '@nestjs/config'
import type { ExcelModuleOptions } from '~nestjs-modules/excel'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'

export const ExcelConfig = registerAs('excel', () => {
  return match(APP_ENV)
    .returnType<ExcelModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({}))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type IExcelConfig = ConfigType<typeof ExcelConfig>
