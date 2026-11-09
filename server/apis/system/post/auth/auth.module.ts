import { Module } from '@nestjs/common'
import { SystemPostAuthController } from './auth.controller'
import { SystemPostAuthService } from './auth.service'

@Module({
  controllers: [SystemPostAuthController],
  providers: [SystemPostAuthService],
})
export class SystemPostAuthModule {}
