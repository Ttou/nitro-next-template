import type { DynamicModule, OnModuleDestroy } from '@nestjs/common'
import type { RedisClient } from './interface'
import { Inject, Module } from '@nestjs/common'
import { REDIS_CLIENT } from './constant'
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, OPTIONS_TYPE } from './module-define'
import { RedisProvider } from './provider'
import { RedisService } from './service'

@Module({
  providers: [
    RedisProvider,
    RedisService,
  ],
  exports: [
    RedisService,
    REDIS_CLIENT,
  ],
})
export class RedisModule extends ConfigurableModuleClass implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT) private redisClient: RedisClient,
  ) {
    super()
  }

  async onModuleDestroy() {
    // 等待所有正在执行的命令完成，优雅退出
    await this.redisClient.quit()
  }

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
