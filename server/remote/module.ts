import { Global, Module } from '@nestjs/common'
import { RemoteIpService } from './ip'
import { RemoteTranslateService } from './translate'

@Global()
@Module({
  providers: [RemoteIpService, RemoteTranslateService],
  exports: [RemoteIpService, RemoteTranslateService],
})
export class RemoteModule {}
