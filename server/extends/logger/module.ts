import type { DynamicModule } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { LOGGER } from './constant'
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, OPTIONS_TYPE } from './module-define'
import { LoggerProvider } from './provider'
import { LoggerService } from './service'

@Module({
  providers: [
    LoggerProvider,
    LoggerService,
  ],
  exports: [
    LOGGER,
    LoggerService,
  ],
})
export class LoggerModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.register(options),
    }
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.registerAsync(options),
    }
  }
}
