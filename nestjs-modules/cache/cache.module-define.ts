import type { InjectionToken } from '@nestjs/common'
import type { CacheModuleOptions } from './cache.interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'
import { CACHE_REDIS } from './cache.constant'

export interface CacheModuleExtras {
  isGlobal?: boolean
  redisToken?: InjectionToken
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
  = new ConfigurableModuleBuilder<CacheModuleOptions>()
    .setFactoryMethodName('createCacheOptions')
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
            ? [
                { provide: CACHE_REDIS, useExisting: extras.redisToken },
              ]
            : []),
        ],
      }),
    )
    .build()
