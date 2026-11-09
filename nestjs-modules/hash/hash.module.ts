import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './hash.module-define'
import { HashService } from './hash.service'

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule extends ConfigurableModuleClass {}
