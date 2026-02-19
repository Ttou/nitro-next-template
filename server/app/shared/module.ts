import { Global, Module } from '@nestjs/common'
import { RedisProvider } from '../providers'
import { CacheService, CaptchaService, HashService, LogoutService, RedisScanner } from '../services'
import { SharedService } from './service'

@Global()
@Module({
  providers: [
    RedisProvider,
    RedisScanner,
    CacheService,
    HashService,
    CaptchaService,
    LogoutService,
    SharedService,
  ],
  exports: [
    RedisProvider,
    RedisScanner,
    CacheService,
    HashService,
    CaptchaService,
    LogoutService,
    SharedService,
  ],
})
export class SharedModule {}
