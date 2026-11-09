import { Module } from '@nestjs/common'
import { SystemLangController } from './lang.controller'
import { SystemLangService } from './lang.service'

@Module({
  controllers: [SystemLangController],
  providers: [SystemLangService],
})
export class SystemLangModule {}
