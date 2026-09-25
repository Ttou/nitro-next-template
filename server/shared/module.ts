import { Global, Module } from '@nestjs/common'
import { CacheService } from './cache'
import { ContextService } from './context'
import { IpService } from './ip'
import { RedisExtendService } from './redis-extend'
import { TranslateService } from './translate'

@Global()
@Module({
  providers: [
    ContextService,
    IpService,
    RedisExtendService,
    CacheService,
    TranslateService,
  ],
  exports: [
    ContextService,
    IpService,
    RedisExtendService,
    CacheService,
    TranslateService,
  ],
})
export class SharedModule {}
