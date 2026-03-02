import { Global, Module } from '@nestjs/common'
import { CacheService, CaptchaService, HashService, LogoutService } from '../services'
import { SharedService } from './service'

@Global()
@Module({
  providers: [
    CacheService,
    HashService,
    CaptchaService,
    LogoutService,
    SharedService,
  ],
  exports: [
    CacheService,
    HashService,
    CaptchaService,
    LogoutService,
    SharedService,
  ],
})
export class SharedModule {}
