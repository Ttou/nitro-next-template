import { Module } from '@nestjs/common'
import { SystemDictTypeController } from './controller'
import { SystemDictTypeService } from './service'

@Module({
  controllers: [SystemDictTypeController],
  providers: [SystemDictTypeService],
})
export class SystemDictTypeModule {}
