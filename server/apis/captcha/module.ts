import { Module } from '@nestjs/common'
import { CaptchaController } from './controller'

@Module({
  controllers: [CaptchaController],
})
export class CaptchaModule {}
