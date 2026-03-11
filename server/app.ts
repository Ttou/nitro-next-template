import type { IRequest } from './interfaces'
import { MySqlDriver } from '@mikro-orm/mysql'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { ClsModule } from 'nestjs-cls'
import { generateId } from '~shared/utils'
import { ApisModule } from './apis'
import { ConfigSchema, configuration } from './configs'
import { CacheModule, CaptchaModule, ExcelModule, HashModule, LogoutModule, RedisModule } from './extends'
import { DefaultFilter } from './filters'
import { AuthenticationGuard, AuthorizationGuard } from './guards'
import { LoggingInterceptor } from './interceptors'
import { ValidationPipe } from './pipes'
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
        guard: {
          mount: true,
        },
      }),
    }),
    RedisModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['redis']>('redis')!
      },
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    CaptchaModule.register({
      isGlobal: true,
    }),
    ExcelModule.register({
      isGlobal: true,
    }),
    LogoutModule.register({
      isGlobal: true,
    }),
    HashModule.register({
      isGlobal: true,
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
        return configService.get<ConfigSchema['orm']>('orm')!
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
      useClass: LoggingInterceptor,
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
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: DefaultFilter,
    },
  ],
})
export class AppModule {}
