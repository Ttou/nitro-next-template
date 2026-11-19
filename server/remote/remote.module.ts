import { Global, Module } from '@nestjs/common'
import { RemoteIpService } from './ip.service'

@Global()
@Module({
  providers: [RemoteIpService],
  exports: [RemoteIpService],
})
export class RemoteModule {}
