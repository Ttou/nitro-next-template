import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HttpHealthIndicator } from '~server/customs'
import { HealthController } from './health.controller'

@Module({
  imports: [
    TerminusModule.forRoot(),
  ],
  controllers: [HealthController],
  providers: [HttpHealthIndicator],
})
export class HealthModule {}
