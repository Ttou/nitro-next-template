import { Global, Module } from '@nestjs/common'
import { ContextService } from './context'
import { IpService } from './ip'

@Global()
@Module({
  providers: [
    ContextService,
    IpService,
  ],
  exports: [
    ContextService,
    IpService,
  ],
})
export class SharedModule {}
