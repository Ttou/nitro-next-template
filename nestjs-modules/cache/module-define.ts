import type { InjectionToken } from '@nestjs/common'
import type { CacheModuleOptions } from './interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'
import { CACHE_REDIS } from './constant'

export interface CacheModuleExtras {
  isGlobal?: boolean
  redisToken?: InjectionToken
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
  = new ConfigurableModuleBuilder<CacheModuleOptions>()
    .setExtras<CacheModuleExtras>(
      {
        isGlobal: false,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
        providers: [
          ...(definition.providers ?? []),
          ...(extras.redisToken
            ? [{ provide: CACHE_REDIS, useExisting: extras.redisToken }]
            : []),
        ],
      }),
    )
    .build()
