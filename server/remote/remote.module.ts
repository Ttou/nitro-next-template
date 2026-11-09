import { Global, Module } from '@nestjs/common'
import { RemoteIpService } from './ip.service'
import { RemoteTranslateService } from './translate.service'

@Global()
@Module({
  providers: [RemoteIpService, RemoteTranslateService],
  exports: [RemoteIpService, RemoteTranslateService],
})
export class RemoteModule {}
