import { Module } from '@nestjs/common'
import { SystemLangController } from './controller'
import { SystemLangService } from './service'

@Module({
  controllers: [SystemLangController],
  providers: [SystemLangService],
})
export class SystemLangModule {}
