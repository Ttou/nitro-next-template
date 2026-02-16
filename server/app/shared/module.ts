import { Global, Module } from '@nestjs/common'
import { RedisProvider } from '../providers'
import { CacheService, HashService, RedisScanner } from '../services'

@Global()
@Module({
  providers: [
    RedisProvider,
    RedisScanner,
    CacheService,
    HashService,
  ],
  exports: [
    RedisProvider,
    RedisScanner,
    CacheService,
    HashService,
  ],
})
export class SharedModule {}
