import type { InjectionToken } from '@nestjs/common'
import type { CaptchaModuleOptions } from './interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'
import { CAPTCHA_REDIS } from './constant'

export interface CaptchaModuleExtras {
  isGlobal?: boolean
  redisToken?: InjectionToken
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
  = new ConfigurableModuleBuilder<CaptchaModuleOptions>()
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
            ? [{ provide: CAPTCHA_REDIS, useExisting: extras.redisToken }]
            : []),
        ],
      }),
    )
    .build()
