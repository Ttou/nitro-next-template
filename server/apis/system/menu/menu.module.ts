import { Module } from '@nestjs/common'
import { SystemMenuController } from './menu.controller'
import { SystemMenuService } from './menu.service'

@Module({
  controllers: [SystemMenuController],
  providers: [SystemMenuService],
})
export class SystemMenuModule {}
