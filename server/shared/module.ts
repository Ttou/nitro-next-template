import { Global, Module } from '@nestjs/common'
import { ContextService } from './context'
import { IpService } from './ip'
import { TranslateService } from './translate'

@Global()
@Module({
  providers: [
    ContextService,
    IpService,
    TranslateService,
  ],
  exports: [
    ContextService,
    IpService,
    TranslateService,
  ],
})
export class SharedModule {}
