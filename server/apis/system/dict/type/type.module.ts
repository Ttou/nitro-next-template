import { Module } from '@nestjs/common'
import { SystemDictTypeController } from './type.controller'
import { SystemDictTypeService } from './type.service'

@Module({
  controllers: [SystemDictTypeController],
  providers: [SystemDictTypeService],
})
export class SystemDictTypeModule {}
