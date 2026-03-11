import type { ExcelModuleOptions } from './interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'

export const { MODULE_OPTIONS_TOKEN: EXCEL_MODULE_OPTIONS, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE, ConfigurableModuleClass } = new ConfigurableModuleBuilder<ExcelModuleOptions>().setExtras({
  isGlobal: true,
}, (definition, extras) => ({
  ...definition,
  global: extras.isGlobal,
})).build()
