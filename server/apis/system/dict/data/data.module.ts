import { Module } from '@nestjs/common'
import { SystemDictDataController } from './data.controller'
import { SystemDictDataService } from './data.service'

@Module({
  controllers: [SystemDictDataController],
  providers: [SystemDictDataService],
})
export class SystemDictDataModule {}
