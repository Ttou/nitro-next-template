import type { BcryptOptions } from 'hash-wasm'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'

export interface IHashConfig {
  bcrypt?: Omit<BcryptOptions, 'password'>
}

export const HashConfig = registerAs('hash', () => {
  return match(APP_ENV)
    .returnType<IHashConfig>()
    .with(AppEnvEnum.DEV, () => ({
      bcrypt: {
        salt: '$2b$10$v0UAl9V6T7OpZAlYZKvc5O==',
        costFactor: 10,
      },
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})
