import { Module } from '@nestjs/common'
import { SystemRoleAuthController } from './controller'
import { SystemRoleAuthService } from './service'

@Module({
  controllers: [SystemRoleAuthController],
  providers: [SystemRoleAuthService],
})
export class SystemRoleAuthModule {}
