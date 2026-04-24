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
  ],
  controllers: [HealthController],
})
export class HealthModule {}
