import { MySqlDriver } from '@mikro-orm/mysql'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { RedisModule } from '@nestjs-modules/ioredis'
import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { BadRequestException, Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { JwtStrategy, XltTokenModule } from '@xlt-token/nestjs'
import { ClsModule } from 'nestjs-cls'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { LoggerModule } from 'nestjs-pino'
import { ApisModule } from './apis'
import {
  BullBoardConfig,
  BullConfig,
  CacheConfig,
  ClsConfig,
  FormDataConfig,
  HashConfig,
  LoggerConfig,
  MikroOrmConfig,
  RedisConfig,
  XltTokenConfig,
} from './configs'
import { CustomXltRedis, CustomXltStp } from './customs'
import { DefaultFilter } from './filters'
import { LoginGuard, PermissionGuard } from './guards'
import { OperateInterceptor } from './interceptors'
import { QueuesModule } from './queues'
import { SharedModule } from './shared'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      skipProcessEnv: true,
      load: [
        ClsConfig,
        CacheConfig,
        LoggerConfig,
        RedisConfig,
        FormDataConfig,
        MikroOrmConfig,
        BullConfig,
        BullBoardConfig,
        HashConfig,
      ],
    }),
    ClsModule.forRootAsync({
      global: true,
      ...ClsConfig.asProvider(),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      ...CacheConfig.asProvider(),
    }),
    LoggerModule.forRootAsync(LoggerConfig.asProvider()),
    RedisModule.forRootAsync(RedisConfig.asProvider()),
    NestjsFormDataModule.configAsync({
      isGlobal: true,
      ...FormDataConfig.asProvider(),
    }),
    HttpModule.register({
      global: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: MySqlDriver,
      ...MikroOrmConfig.asProvider(),
    }),
    XltTokenModule.forRootAsync({
      isGlobal: true,
      stpInterface: CustomXltStp,
      strategy: {
        useClass: JwtStrategy,
      },
      store: {
        useClass: CustomXltRedis,
      },
      ...XltTokenConfig.asProvider(),
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
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
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
