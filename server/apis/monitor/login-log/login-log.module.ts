import { Module } from '@nestjs/common'
import { MonitorLoginLogController } from './login-log.controller'
import { MonitorLoginLogService } from './login-log.service'

@Module({
  controllers: [MonitorLoginLogController],
  providers: [MonitorLoginLogService],
})
export class MonitorLoginLogModule {}
