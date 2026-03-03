import { Global, Module } from '@nestjs/common'
import { LogoutService } from '../services'
import { SharedService } from './service'

@Global()
@Module({
  providers: [
    LogoutService,
    SharedService,
  ],
  exports: [
    LogoutService,
    SharedService,
  ],
})
export class SharedModule {}
