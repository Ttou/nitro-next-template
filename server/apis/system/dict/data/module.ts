import { Module } from '@nestjs/common'
import { SystemDictDataController } from './controller'
import { SystemDictDataService } from './service'

@Module({
  controllers: [SystemDictDataController],
  providers: [SystemDictDataService],
})
export class SystemDictDataModule {}
