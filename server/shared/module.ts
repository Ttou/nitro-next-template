import { Global, Module } from '@nestjs/common'
import { CacheService } from './cache'
import { ContextService } from './context'
import { ExcelService } from './excel'
import { HashService } from './hash'
import { IpService } from './ip'
import { RedisExtendService } from './redis-extend'
import { TranslateService } from './translate'

@Global()
@Module({
  providers: [
    ContextService,
    IpService,
    HashService,
    ExcelService,
    RedisExtendService,
    CacheService,
    TranslateService,
  ],
  exports: [
    ContextService,
    IpService,
    HashService,
    ExcelService,
    RedisExtendService,
    CacheService,
    TranslateService,
  ],
})
export class SharedModule {}
