import type { MiddlewareConsumer, NestModule } from '@nestjs/common'
import type { ConfigSchema } from '~server/configs'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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
export class HealthModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const middleware = this.configService.get<ConfigSchema['healthBasicAuth']>('healthBasicAuth')
    consumer.apply(middleware).forRoutes(HealthController)
  }
}
