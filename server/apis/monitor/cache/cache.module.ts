import { Module } from '@nestjs/common'
import { MonitorCacheController } from './cache.controller'
import { MonitorCacheService } from './cache.service'

@Module({
  controllers: [MonitorCacheController],
  providers: [MonitorCacheService],
})
export class MonitorCacheModule {}
