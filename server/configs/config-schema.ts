import type { BullBoardModuleOptions } from '@bull-board/nestjs'
import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { RedisModuleOptions } from '@nestjs-modules/ioredis'
import type { BullRootModuleOptions } from '@nestjs/bullmq'
import type { CacheModuleOptions } from '@nestjs/cache-manager'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { XltTokenModuleOptions } from '@xlt-token/nestjs'
import type { BcryptOptions } from 'hash-wasm'
import type { FormDataInterceptorConfig } from 'nestjs-form-data'

export class ConfigSchema {
  appName: string

  redisShared: {
    host: string
    port: number
    db: number
  }

  hash: {
    bcrypt?: Omit<BcryptOptions, 'password'>
  }

  cache: CacheModuleOptions

  jwt: JwtModuleOptions

  redis: RedisModuleOptions

  orm: MikroOrmModuleOptions

  bull: BullRootModuleOptions

  bullBoard: BullBoardModuleOptions

  formData?: FormDataInterceptorConfig

  xltToken: XltTokenModuleOptions['config']
}
