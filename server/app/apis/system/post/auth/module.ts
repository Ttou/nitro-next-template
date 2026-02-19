import { Module } from '@nestjs/common'
import { SystemPostAuthController } from './controller'
import { SystemPostAuthService } from './service'

@Module({
  controllers: [SystemPostAuthController],
  providers: [SystemPostAuthService],
})
export class SystemPostAuthModule {}
