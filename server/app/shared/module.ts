import { Global, Module } from '@nestjs/common'
import { CaptchaService, HashService, LogoutService } from '../services'
import { SharedService } from './service'

@Global()
@Module({
  providers: [
    HashService,
    CaptchaService,
    LogoutService,
    SharedService,
  ],
  exports: [
    HashService,
    CaptchaService,
    LogoutService,
    SharedService,
  ],
})
export class SharedModule {}
