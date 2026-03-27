import type { LogContext, LoggerNamespace } from '@mikro-orm/core'
import type { IRequest } from './interfaces'
import { DefaultLogger } from '@mikro-orm/core'
import { MySqlDriver } from '@mikro-orm/mysql'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { HttpModule } from '@nestjs/axios'
import { BadRequestException, Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { ClsModule } from 'nestjs-cls'
import { generateId } from '~shared/utils'
import { ApisModule } from './apis'
import { ConfigSchema, configuration } from './configs'
import { CacheModule, CaptchaModule, ExcelModule, HashModule, LoggerModule, LoggerService, LogoutModule, RedisModule, UploadModule } from './extends'
import { DefaultFilter } from './filters'
import { AuthenticationGuard, AuthorizationGuard } from './guards'
import { HealthModule } from './health'
import { LoggingInterceptor, OperateInterceptor } from './interceptors'
import { QueuesModule } from './queues'
import { SharedModule } from './shared'
import { colorGray } from './utils'

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
        guard: {
          mount: true,
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
      useFactory: (configService: ConfigService, loggerService: LoggerService) => {
        loggerService.setContext(MikroOrmModule.name)

        class OrmLogger extends DefaultLogger {
          override log(namespace: LoggerNamespace, message: string, context?: LogContext) {
            loggerService.log(this.getMessage(namespace, message), context)
          }

          override error(namespace: LoggerNamespace, message: string, context?: LogContext) {
            loggerService.error(this.getMessage(namespace, message), context)
          }

          override warn(namespace: LoggerNamespace, message: string, context?: LogContext) {
            loggerService.warn(this.getMessage(namespace, message), context)
          }

          private getMessage(namespace: LoggerNamespace, message: string) {
            return [colorGray(`[${namespace}]`), message].join(' ')
          }
        }

        return {
          ...configService.get<ConfigSchema['orm']>('orm')!,
          loggerFactory: options => new OrmLogger(options),
        }
      },
      inject: [ConfigService, LoggerService],
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
