import { MySqlDriver } from '@mikro-orm/mysql'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { getRedisConnectionToken, RedisModule } from '@nestjs-modules/ioredis'
import { BadRequestException, Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core'
import { HttpClientModule } from '@nestjs/http-client'
import { MulterModule } from '@nestjs/platform-node'
import { XltTokenModule } from '@xlt-token/nestjs'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import { CacheModule } from '~nestjs-modules/cache'
import { CaptchaModule } from '~nestjs-modules/captcha'
import { ExcelModule } from '~nestjs-modules/excel'
import { HashModule } from '~nestjs-modules/hash'
import { ApisModule } from './apis'
import {
  BullBoardConfig,
  BullConfig,
  CacheConfig,
  CaptchaConfig,
  ClsConfig,
  ExcelConfig,
  HashConfig,
  LoggerConfig,
  MikroOrmConfig,
  MulterConfig,
  RedisConfig,
  XltTokenConfig,
} from './configs'
import { ContextModule } from './context'
import { CustomXltRedis, CustomXltStp } from './customs'
import { DefaultFilter } from './filters'
import { XltTokenGuard } from './guards'
import { QueuesModule } from './queues'
import { RemoteModule } from './remote'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      skipProcessEnv: true,
      load: [
        ClsConfig,
        LoggerConfig,
        RedisConfig,
        MikroOrmConfig,
        MulterConfig,
        BullConfig,
        BullBoardConfig,
        HashConfig,
      ],
    }),
    ClsModule.forRootAsync({
      global: true,
      ...ClsConfig.asProvider(),
    }),
    LoggerModule.forRootAsync(LoggerConfig.asProvider()),
    RedisModule.forRootAsync(RedisConfig.asProvider()),
    HttpClientModule.register({
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: MySqlDriver,
      ...MikroOrmConfig.asProvider(),
    }),
    {
      global: true,
      ...MulterModule.registerAsync({
        ...MulterConfig.asProvider(),
      }),
    },
    XltTokenModule.forRootAsync({
      isGlobal: true,
      stpInterface: CustomXltStp,
      store: {
        useClass: CustomXltRedis,
      },
      ...XltTokenConfig.asProvider(),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      redisToken: getRedisConnectionToken(),
      ...CacheConfig.asProvider(),
    }),
    CaptchaModule.registerAsync({
      isGlobal: true,
      redisToken: getRedisConnectionToken(),
      ...CaptchaConfig.asProvider(),
    }),
    ExcelModule.registerAsync({
      isGlobal: true,
      ...ExcelConfig.asProvider(),
    }),
    HashModule.registerAsync({
      isGlobal: true,
      ...HashConfig.asProvider(),
    }),
    RemoteModule,
    ContextModule,
    QueuesModule,
    ApisModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: XltTokenGuard,
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
