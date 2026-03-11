import { Module } from '@nestjs/common'
import { SystemRoleController } from './controller'
import { SystemRoleService } from './service'

@Module({
  controllers: [SystemRoleController],
  providers: [SystemRoleService],
})
export class SystemRoleModule {}
