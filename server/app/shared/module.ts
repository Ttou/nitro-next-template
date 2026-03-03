import { Global, Module } from '@nestjs/common'
import { HashService, LogoutService } from '../services'
import { SharedService } from './service'

@Global()
@Module({
  providers: [
    HashService,
    LogoutService,
    SharedService,
  ],
  exports: [
    HashService,
    LogoutService,
    SharedService,
  ],
})
export class SharedModule {}
