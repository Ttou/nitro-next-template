import type { ConfigType } from '@nestjs/config'
import type { CaptchaModuleOptions } from '~nestjs-modules/captcha'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { SharedConfig } from './shared'

export const CaptchaConfig = registerAs('captcha', () => {
  const { appName } = SharedConfig
  return match(APP_ENV)
    .returnType<CaptchaModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({
      keyPrefix: [appName, 'captcha'].join(':'),
      expire: '3m',
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type ICaptchaConfig = ConfigType<typeof CaptchaConfig>
