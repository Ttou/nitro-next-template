import { stdout } from 'node:process'
import { MySqlDriver } from '@mikro-orm/mysql'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { RedisModule } from '@nestjs-modules/ioredis'
import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { BadRequestException, Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { ClsModule } from 'nestjs-cls'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { LoggerModule } from 'nestjs-pino'
import pinoPretty from 'pino-pretty'
import * as entities from '~shared/database/entities'
import { ApisModule } from './apis'
import { ConfigSchema, configuration } from './configs'
import { CustomOrmLogger } from './customs'
import { DefaultFilter } from './filters'
import { AuthenticationGuard, AuthorizationGuard } from './guards'
import { OperateInterceptor } from './interceptors'
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
          idGenerator: req => req.id,
        },
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['cache']>('cache')!
      },
      inject: [ConfigService],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        stream: pinoPretty({
          destination: stdout.fd,
          hideObject: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          messageFormat(log, messageKey, levelLabel, { colors }) {
            /**
             * 响应时间
             * @description 请求会记录响应时间
             */
            const responseTime = log.responseTime !== undefined ? colors.yellow(`[${log.responseTime}ms]`) : undefined

            return [
              responseTime ? colors.gray(`[HttpLogging]`) : undefined,
              log.context ? colors.gray(`[${log.context}]`) : undefined,
              log.req?.id ? colors.gray(`[${log.req.id}]`) : undefined,
              log.namespace ? colors.gray(`[${log.namespace}]`) : undefined, // ORM 日志命名空间
              log[messageKey],
              responseTime,
            ]
              .filter(Boolean)
              .join(' ')
          },
        }),
        customSuccessMessage(req, res, responseTime) {
          return `${req.method} - ${req.url} - ${res.statusCode}`
        },
        customErrorMessage(req, res, err) {
          return `${req.method} - ${req.url} - ${res.statusCode}`
        },
      },
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['redis']>('redis')!
      },
      inject: [ConfigService],
    }),
    NestjsFormDataModule.configAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['formData']>('formData')!
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
      useFactory: (configService: ConfigService) => {
        return {
          ...configService.get<ConfigSchema['orm']>('orm')!,
          entities: Object.values(entities),
          loggerFactory: options => new CustomOrmLogger(options),
        }
      },
      inject: [ConfigService],
    }),
    QueuesModule,
    SharedModule,
    ApisModule,
  ],
  providers: [
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
