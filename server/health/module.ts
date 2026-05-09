import { RedisHealthModule } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './controller'

@Module({
  imports: [
    TerminusModule.forRootAsync({
      useFactory: () => ({
        logger: true,
        errorLogStyle: 'pretty',
      }),
    }),
    RedisHealthModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
