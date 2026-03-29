import type { LogContext, LoggerNamespace } from '@mikro-orm/core'
import type { Logger } from './extends'
import type { IRequest } from './interfaces'
import { DefaultLogger } from '@mikro-orm/core'
import { MySqlDriver } from '@mikro-orm/mysql'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { HttpModule } from '@nestjs/axios'
import { BadRequestException, Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { colorize, LOG_COLORS } from '@tsed/logger'
import { ClsModule } from 'nestjs-cls'
import { generateId } from '~shared/utils'
import { ApisModule } from './apis'
import { ConfigSchema, configuration } from './configs'
import { CacheModule, CaptchaModule, ExcelModule, HashModule, LOGGER, LoggerModule, LogoutModule, RedisModule, UploadModule } from './extends'
import { DefaultFilter } from './filters'
import { AuthenticationGuard, AuthorizationGuard } from './guards'
import { HealthModule } from './health'
import { LoggingInterceptor, OperateInterceptor } from './interceptors'
import { QueuesModule } from './queues'
import { SharedModule } from './shared'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      skipProcessEnv: true,
      load: [configuration],
    }),
    ClsModule.forRootAsync({
      global: true,
      useFactory: () => ({
        middleware: {
          mount: true,
          generateId: true,
          idGenerator: (req: IRequest) =>
            (req.headers['X-Request-Id'] as string) ?? generateId(),
        },
      }),
    }),
    LoggerModule.register({
      isGlobal: true,
    }),
    RedisModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['redis']>('redis')!
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['cache']>('cache')!
      },
      inject: [ConfigService],
    }),
    CaptchaModule.register({
      isGlobal: true,
    }),
    LogoutModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['logout']>('logout')!
      },
      inject: [ConfigService],
    }),
    ExcelModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['excel']>('excel')!
      },
      inject: [ConfigService],
    }),
    HashModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['hash']>('hash')!
      },
      inject: [ConfigService],
    }),
    HttpModule.register({
      global: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['jwt']>('jwt')!
      },
      inject: [ConfigService],
    }),
    MikroOrmModule.forRootAsync({
      driver: MySqlDriver,
      useFactory: (configService: ConfigService, logger: Logger) => {
        class OrmLogger extends DefaultLogger {
          override logQuery(context: { query: string } & LogContext): void {
            logger.debug(this.getMessage('query', context.query), this.getRestData(context))
          }

          override log(namespace: LoggerNamespace, message: string, context?: LogContext) {
            logger.info(this.getMessage(namespace, message), this.getRestData(context))
          }

          override error(namespace: LoggerNamespace, message: string, context?: LogContext) {
            logger.error(this.getMessage(namespace, message), this.getRestData(context))
          }

          override warn(namespace: LoggerNamespace, message: string, context?: LogContext) {
            logger.warn(this.getMessage(namespace, message), this.getRestData(context))
          }

          private getMessage(namespace: LoggerNamespace, message: string) {
            return [colorize(`[${namespace}]`, LOG_COLORS.DEBUG), message].join(' ')
          }

          private getRestData(context?: LogContext) {
            return {
              context: MikroOrmModule.name,
            }
          }
        }

        return {
          ...configService.get<ConfigSchema['orm']>('orm')!,
          loggerFactory: options => new OrmLogger(options),
        }
      },
      inject: [ConfigService, LOGGER],
    }),
    UploadModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['upload']>('upload')!
      },
      inject: [ConfigService],
    }),
    QueuesModule,
    SharedModule,
    ApisModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: OperateInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
        transform: true,
        exceptionFactory(errors) {
          const firstErrorMessage = Object.values(errors[0]!.constraints!)[0]
          return new BadRequestException(firstErrorMessage)
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: DefaultFilter,
    },
  ],
})
export class AppModule {}
