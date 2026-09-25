import type { HashModuleOptions } from './interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'

export interface HashModuleExtras {
  isGlobal?: boolean
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
  = new ConfigurableModuleBuilder<HashModuleOptions>()
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
