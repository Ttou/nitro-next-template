import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './module-define'
import { HashService } from './service'

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule extends ConfigurableModuleClass {}
