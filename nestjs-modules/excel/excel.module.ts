import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './excel.module-define'
import { ExcelService } from './excel.service'

@Module({
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule extends ConfigurableModuleClass {}
