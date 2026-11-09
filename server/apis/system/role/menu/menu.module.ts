import { Module } from '@nestjs/common'
import { SystemRoleMenuController } from './menu.controller'
import { SystemRoleMenuService } from './menu.service'

@Module({
  controllers: [SystemRoleMenuController],
  providers: [SystemRoleMenuService],
})
export class SystemRoleMenuModule {}
