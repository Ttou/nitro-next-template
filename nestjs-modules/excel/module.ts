import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './module-define'
import { ExcelService } from './service'

@Module({
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule extends ConfigurableModuleClass {}
