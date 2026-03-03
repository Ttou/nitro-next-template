import { Global, Module } from '@nestjs/common'
import { ContextService } from './context'
import { ParseService } from './parse'

@Global()
@Module({
  providers: [
    ContextService,
    ParseService,
  ],
  exports: [
    ContextService,
    ParseService,
  ],
})
export class SharedModule {}
