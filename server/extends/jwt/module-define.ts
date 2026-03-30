import type { JwtModuleOptions } from './interface'
import { ConfigurableModuleBuilder } from '@nestjs/common'

export const { MODULE_OPTIONS_TOKEN: JWT_MODULE_OPTIONS, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE, ConfigurableModuleClass } = new ConfigurableModuleBuilder<JwtModuleOptions>().setExtras({
  isGlobal: true,
}, (definition, extras) => ({
  ...definition,
  global: extras.isGlobal,
})).build()
