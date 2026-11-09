import type { HashModuleOptions } from './hash.interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'

export interface HashModuleExtras {
  isGlobal?: boolean
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
  = new ConfigurableModuleBuilder<HashModuleOptions>()
    .setFactoryMethodName('createHashOptions')
    .setExtras<HashModuleExtras>(
      {
        isGlobal: false,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build()
