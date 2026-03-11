import { Module } from '@nestjs/common'
import { MonitorOnlineController } from './controller'
import { MonitorOnlineService } from './service'

@Module({
  controllers: [MonitorOnlineController],
  providers: [MonitorOnlineService],
})
export class MonitorOnlineModule {}
