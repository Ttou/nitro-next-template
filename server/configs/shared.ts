import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'

export interface ISharedConfig {
  appName: string
  redisKeySeparator: string
  redis: {
    host: string
    port: number
    db: number
  }
}

export const SharedConfig = match(APP_ENV)
  .returnType<ISharedConfig>()
  .with(AppEnvEnum.DEV, () => ({
    appName: 'nitro_template',
    redisKeySeparator: ':',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
  }))
  .with(AppEnvEnum.PROD, () => ({}))
  .run()
