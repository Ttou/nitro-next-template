import { Global, Module } from '@nestjs/common'
import { RedisProvider } from '../providers'
import { CacheService, CaptchaService, HashService, RedisScanner } from '../services'
import { SharedService } from './service'

@Global()
@Module({
  providers: [
    RedisProvider,
    RedisScanner,
    CacheService,
    HashService,
    CaptchaService,
    SharedService,
  ],
  exports: [
    RedisProvider,
    RedisScanner,
    CacheService,
    HashService,
    CaptchaService,
    SharedService,
  ],
})
export class SharedModule {}
