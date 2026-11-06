import { Module } from '@nestjs/common'
import { InspectorController } from './controller'

@Module({
  controllers: [InspectorController],
})
export class InspectorModule {}
