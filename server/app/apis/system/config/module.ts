import { Module } from '@nestjs/common'
import { SystemConfigController } from './controller'
import { SystemConfigService } from './service'

@Module({
  controllers: [SystemConfigController],
  providers: [SystemConfigService],
})
export class SystemConfigModule {}
