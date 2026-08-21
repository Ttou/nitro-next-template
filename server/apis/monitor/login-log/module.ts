import { Module } from '@nestjs/common'
import { MonitorLoginLogController } from './controller'
import { MonitorLoginLogService } from './service'

@Module({
  controllers: [MonitorLoginLogController],
  providers: [MonitorLoginLogService],
})
export class MonitorLoginLogModule {}
