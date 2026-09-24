import type { ExcelModuleOptions } from './interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'

export interface ExcelModuleExtras {
  isGlobal?: boolean
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
  = new ConfigurableModuleBuilder<ExcelModuleOptions>()
    .setExtras<ExcelModuleExtras>(
      {
        isGlobal: false,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build()
