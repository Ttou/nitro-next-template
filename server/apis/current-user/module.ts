import { Module } from '@nestjs/common'
import { CurrentUserController } from './controller'
import { CurrentUserService } from './service'

@Module({
  controllers: [CurrentUserController],
  providers: [CurrentUserService],
})
export class CurrentUserModule {}
