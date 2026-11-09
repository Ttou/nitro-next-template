import { Module } from '@nestjs/common'
import { SystemRoleAuthController } from './auth.controller'
import { SystemRoleAuthService } from './auth.service'

@Module({
  controllers: [SystemRoleAuthController],
  providers: [SystemRoleAuthService],
})
export class SystemRoleAuthModule {}
