import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './cache.module-define'
import { CacheRedisExtendService } from './cache.redis-extend.service'
import { CacheService } from './cache.service'

@Module({
  providers: [CacheService, CacheRedisExtendService],
  exports: [CacheService, CacheRedisExtendService],
})
export class CacheModule extends ConfigurableModuleClass {}
