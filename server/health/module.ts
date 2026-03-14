import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { LoggerService } from '~server/extends'
import { HealthController } from './controller'

@Module({
  imports: [
    TerminusModule.forRootAsync({
      useFactory: (loggerService: LoggerService) => ({
        logger: loggerService,
        errorLogStyle: 'pretty',
      }),
      inject: [LoggerService],
    }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
