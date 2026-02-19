import { Module } from '@nestjs/common'
import { SystemRoleMenuController } from './controller'
import { SystemRoleMenuService } from './service'

@Module({
  controllers: [SystemRoleMenuController],
  providers: [SystemRoleMenuService],
})
export class SystemRoleMenuModule {}
