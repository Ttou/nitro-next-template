import { Module } from '@nestjs/common'
import { SystemMenuController } from './controller'
import { SystemMenuService } from './service'

@Module({
  controllers: [SystemMenuController],
  providers: [SystemMenuService],
})
export class SystemMenuModule {}
