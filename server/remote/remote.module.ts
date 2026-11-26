import { Global, Module } from '@nestjs/common'
import { RemoteIpService } from './remote.service'

@Global()
@Module({
  providers: [RemoteIpService],
  exports: [RemoteIpService],
})
export class RemoteModule {}
