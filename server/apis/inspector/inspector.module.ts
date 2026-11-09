import { Module } from '@nestjs/common'
import { InspectorController } from './inspector.controller'

@Module({
  controllers: [InspectorController],
})
export class InspectorModule {}
