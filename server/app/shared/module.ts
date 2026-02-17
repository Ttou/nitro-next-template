import { Global, Module } from '@nestjs/common'
import { RedisProvider } from '../providers'
import { CacheService, HashService, RedisScanner } from '../services'
import { SharedService } from './service'

@Global()
@Module({
  providers: [
    RedisProvider,
    RedisScanner,
    CacheService,
    HashService,
    SharedService,
  ],
  exports: [
    RedisProvider,
    RedisScanner,
    CacheService,
    HashService,
    SharedService,
  ],
})
export class SharedModule {}
