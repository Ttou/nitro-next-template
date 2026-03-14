import { Module } from '@nestjs/common'
import { MonitorCacheController } from './controller'
import { MonitorCacheService } from './service'

@Module({
  controllers: [MonitorCacheController],
  providers: [MonitorCacheService],
})
export class MonitorCacheModule {}
