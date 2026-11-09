import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './captcha.module-define'
import { CaptchaService } from './captcha.service'

@Module({
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule extends ConfigurableModuleClass {}
