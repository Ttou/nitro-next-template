import type { DynamicModule } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { REDIS } from './constant'
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, OPTIONS_TYPE } from './module-define'
import { RedisProvider } from './provider'

@Module({
  providers: [
    RedisProvider,
  ],
  exports: [REDIS],
})
export class RedisModule extends ConfigurableModuleClass {
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
