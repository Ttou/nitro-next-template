import { env } from 'node:process'
import { Enum } from 'enum-plus'

export const AppEnvEnum = Enum({
  DEV: 'dev',
  PROD: 'prod',
})

export const APP_ENV = env.APP_ENV as typeof AppEnvEnum.valueType
