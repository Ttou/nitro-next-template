import type { DynamicModule } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, OPTIONS_TYPE } from './module-define'
import { CacheService } from './service'

@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule extends ConfigurableModuleClass {
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
