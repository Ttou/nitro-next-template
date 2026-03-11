import { Module } from '@nestjs/common'
import { MonitorOperateController } from './controller'
import { MonitorOperateService } from './service'

@Module({
  controllers: [MonitorOperateController],
  providers: [MonitorOperateService],
})
export class MonitorOperateModule {}
