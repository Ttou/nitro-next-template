import { Module } from '@nestjs/common'
import { MonitorOnlineController } from './online.controller'
import { MonitorOnlineService } from './online.service'

@Module({
  controllers: [MonitorOnlineController],
  providers: [MonitorOnlineService],
})
export class MonitorOnlineModule {}
