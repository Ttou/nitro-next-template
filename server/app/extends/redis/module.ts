import type { DynamicModule } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { REDIS_CLIENT } from './constant'
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, OPTIONS_TYPE } from './module-define'
import { RedisProvider } from './provider'
import { RedisScannerService } from './service'

@Module({
  providers: [
    RedisProvider,
    RedisScannerService,
  ],
  exports: [
    REDIS_CLIENT,
    RedisScannerService,
  ],
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
