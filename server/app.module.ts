import { MySqlDriver } from '@mikro-orm/mysql'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { getRedisConnectionToken, RedisModule } from '@nestjs-modules/ioredis'
import { BadRequestException, Module, StandardSchemaValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core'
import { StorageModule } from '@nestjs/storage'
import { XltTokenModule } from '@xlt-token/nestjs'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import { AlovaModule } from '~nestjs-modules/alova'
import { CacheModule } from '~nestjs-modules/cache'
import { CaptchaModule } from '~nestjs-modules/captcha'
import { ExcelModule } from '~nestjs-modules/excel'
import { HashModule } from '~nestjs-modules/hash'
import { ApisModule } from './apis'
import {
  AlovaModuleOptions,
  CacheModuleOptions,
  CaptchaModuleOptions,
  clsModuleAsyncOptions,
  configuration,
  ExcelModuleOptions,
  HashModuleOptions,
  loggerModuleAsyncOptions,
  MikroOrmModuleOptions,
  RedisModuleOptions,
  StorageModuleOptions,
  xltTokenModuleAsyncOptions,
} from './configs'
import { ContextModule } from './context'
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
      load: [configuration],
    }),
    ClsModule.forRootAsync(clsModuleAsyncOptions),
    LoggerModule.forRootAsync(loggerModuleAsyncOptions),
    RedisModule.forRootAsync({
      useClass: RedisModuleOptions,
      inject: [ConfigService],
    }),
    AlovaModule.registerAsync({
      isGlobal: true,
      useClass: AlovaModuleOptions,
      inject: [ConfigService],
    }),
    MikroOrmModule.forRootAsync({
      driver: MySqlDriver,
      useClass: MikroOrmModuleOptions,
      inject: [ConfigService],
    }),
    StorageModule.forRootAsync({
      isGlobal: true,
      useClass: StorageModuleOptions,
      inject: [ConfigService],
    }),
    XltTokenModule.forRootAsync(xltTokenModuleAsyncOptions),
    CacheModule.registerAsync({
      isGlobal: true,
      redisToken: getRedisConnectionToken(),
      useClass: CacheModuleOptions,
      inject: [ConfigService],
    }),
    CaptchaModule.registerAsync({
      isGlobal: true,
      redisToken: getRedisConnectionToken(),
      useClass: CaptchaModuleOptions,
      inject: [ConfigService],
    }),
    ExcelModule.registerAsync({
      isGlobal: true,
      useClass: ExcelModuleOptions,
      inject: [ConfigService],
    }),
    HashModule.registerAsync({
      isGlobal: true,
      useClass: HashModuleOptions,
      inject: [ConfigService],
    }),
    QueuesModule,
    RemoteModule,
    ContextModule,
    ApisModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: XltTokenGuard,
    },
    {
      provide: APP_PIPE,
      // 只校验带 `schema` 选项的参数，其余参数原样透传
      useFactory: () => new StandardSchemaValidationPipe({
        exceptionFactory: issues => new BadRequestException(issues[0]?.message),
      }),
    },
    {
      provide: APP_FILTER,
      useClass: DefaultFilter,
    },
  ],
})
export class AppModule {}
