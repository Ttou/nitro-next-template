import { ConfigurableModuleBuilder } from '@nestjs/common'

export const { MODULE_OPTIONS_TOKEN: CACHE_MODULE_OPTIONS, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE, ConfigurableModuleClass } = new ConfigurableModuleBuilder().setExtras({
  isGlobal: true,
}, (definition, extras) => ({
  ...definition,
  global: extras.isGlobal,
})).build()
