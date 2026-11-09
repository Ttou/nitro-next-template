import { Module } from '@nestjs/common'
import { SystemConfigController } from './config.controller'
import { SystemConfigService } from './config.service'

@Module({
  controllers: [SystemConfigController],
  providers: [SystemConfigService],
})
export class SystemConfigModule {}
