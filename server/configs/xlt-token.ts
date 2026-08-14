import type { ConfigType } from '@nestjs/config'
import type { XltTokenModuleOptions } from '@xlt-token/nestjs'
import { registerAs } from '@nestjs/config'
import { createJwtStrategyConfig, JwtStrategy } from '@xlt-token/jwt'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'

export const XltTokenConfig = registerAs('xlt-token', () => {
  return match(APP_ENV)
    .returnType<XltTokenModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({
      config: {
        timeout: '7d',
      },
      strategy: {
        useValue: new JwtStrategy(
          createJwtStrategyConfig({
            activeKid: '2026-08',
            keys: [
              { kid: '2026-08', algorithm: 'HS256', secret: 'c426fcc9dd2776153bb58b8b9ec69f3c53f02a2053f398ca513f4104ad482ad5' },
            ],
            issuer: 'xlt-token',
          }),
        ),
      },
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type IXltTokenConfig = ConfigType<typeof XltTokenConfig>
