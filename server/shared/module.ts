import { Global, Module } from '@nestjs/common'
import { CaptchaService } from './captcha'
import { ContextService } from './context'
import { ExcelService } from './excel'
import { HashService } from './hash'
import { IpService } from './ip'
import { LogoutService } from './logout'

@Global()
@Module({
  providers: [
    ContextService,
    IpService,
    LogoutService,
    CaptchaService,
    HashService,
    ExcelService,
  ],
  exports: [
    ContextService,
    IpService,
    LogoutService,
    CaptchaService,
    HashService,
    ExcelService,
  ],
})
export class SharedModule {}
