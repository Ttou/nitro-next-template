import type { LoggerModuleOptions } from './interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'

export const { MODULE_OPTIONS_TOKEN: LOGGER_MODULE_OPTIONS, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE, ConfigurableModuleClass } = new ConfigurableModuleBuilder<LoggerModuleOptions>().setExtras({
  isGlobal: true,
}, (definition, extras) => ({
  ...definition,
  global: extras.isGlobal,
})).build()
