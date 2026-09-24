import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './module-define'
import { CaptchaService } from './service'

@Module({
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule extends ConfigurableModuleClass {}
