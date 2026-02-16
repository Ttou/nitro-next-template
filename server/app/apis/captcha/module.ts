import { Module } from '@nestjs/common'
import { CaptchaController } from './controller'
import { CaptchaService } from './service'

@Module({
  controllers: [CaptchaController],
  providers: [CaptchaService],
})
export class CaptchaModule {}
