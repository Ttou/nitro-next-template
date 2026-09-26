import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './module-define'
import { CacheRedisExtendService } from './redis-extend'
import { CacheService } from './service'

@Module({
  providers: [CacheService, CacheRedisExtendService],
  exports: [CacheService, CacheRedisExtendService],
})
export class CacheModule extends ConfigurableModuleClass {}
