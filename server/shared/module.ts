import { Global, Module } from '@nestjs/common'
import { CacheService } from './cache'
import { CaptchaService } from './captcha'
import { ContextService } from './context'
import { ExcelService } from './excel'
import { HashService } from './hash'
import { IpService } from './ip'
import { LogoutService } from './logout'
import { RedisExtendService } from './redis-extend'

@Global()
@Module({
  providers: [
    ContextService,
    IpService,
    LogoutService,
    CaptchaService,
    HashService,
    ExcelService,
    RedisExtendService,
    CacheService,
  ],
  exports: [
    ContextService,
    IpService,
    LogoutService,
    CaptchaService,
    HashService,
    ExcelService,
    RedisExtendService,
    CacheService,
  ],
})
export class SharedModule {}
