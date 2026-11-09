import type { ExcelModuleOptions } from './excel.interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'

export interface ExcelModuleExtras {
  isGlobal?: boolean
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
  = new ConfigurableModuleBuilder<ExcelModuleOptions>()
    .setFactoryMethodName('createExcelOptions')
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
