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
    const healthConfig = this.configService.get<ConfigSchema['health']>('health')!
    consumer.apply(healthConfig.middleware).forRoutes(HealthController)
  }
}
