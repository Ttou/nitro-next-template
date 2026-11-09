import { Module } from '@nestjs/common'
import { CurrentUserController } from './current-user.controller'
import { CurrentUserService } from './current-user.service'

@Module({
  controllers: [CurrentUserController],
  providers: [CurrentUserService],
})
export class CurrentUserModule {}
