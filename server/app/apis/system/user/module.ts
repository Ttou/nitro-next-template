import { Module } from '@nestjs/common'
import { SystemUserController } from './controller'
import { SystemUserService } from './service'

@Module({
  controllers: [SystemUserController],
  providers: [SystemUserService],
})
export class SystemUserModule {}
