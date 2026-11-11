import type { AlovaModuleOptions } from './alova.interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'

export interface AlovaModuleExtras {
  isGlobal?: boolean
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
  = new ConfigurableModuleBuilder<AlovaModuleOptions>()
    .setFactoryMethodName('createAlovaOptions')
    .setExtras<AlovaModuleExtras>(
      {
        isGlobal: false,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build()
