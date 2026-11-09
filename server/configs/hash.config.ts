import type { HashModuleOptions } from '~nestjs-modules/hash'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { genSalt } from '~nestjs-modules/hash'
import { APP_ENV, AppEnvEnum } from '~server/constants'

export const HashConfig = registerAs('hash', () => {
  return match(APP_ENV)
    .returnType<HashModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({
      bcrypt: {
        salt: genSalt(),
        costFactor: 10,
      },
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})
