import type { InjectionToken } from '@nestjs/common'
import type { CaptchaModuleOptions } from './captcha.interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'
import { CAPTCHA_REDIS } from './captcha.constant'

export interface CaptchaModuleExtras {
  isGlobal?: boolean
  redisToken?: InjectionToken
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
  = new ConfigurableModuleBuilder<CaptchaModuleOptions>()
    .setFactoryMethodName('createCaptchaOptions')
    .setExtras<CaptchaModuleExtras>(
      {
        isGlobal: false,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
        providers: [
          ...(definition.providers ?? []),
          ...(extras.redisToken
            ? [
                { provide: CAPTCHA_REDIS, useExisting: extras.redisToken },
              ]
            : []),
        ],
      }),
    )
    .build()
