import { Global, Module } from '@nestjs/common'
import { CacheService, CaptchaService, HashService, LogoutService, RedisScanner } from '../services'
import { SharedService } from './service'

@Global()
@Module({
  providers: [
    RedisScanner,
    CacheService,
    HashService,
    CaptchaService,
    LogoutService,
    SharedService,
  ],
  exports: [
    RedisScanner,
    CacheService,
    HashService,
    CaptchaService,
    LogoutService,
    SharedService,
  ],
})
export class SharedModule {}
