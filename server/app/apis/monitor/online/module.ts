import { Module } from '@nestjs/common'
import { AuthService } from '../../auth/service'
import { MonitorOnlineController } from './controller'
import { MonitorOnlineService } from './service'

@Module({
  controllers: [MonitorOnlineController],
  providers: [AuthService, MonitorOnlineService],
})
export class MonitorOnlineModule {}
