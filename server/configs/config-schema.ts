import type { BullBoardModuleOptions } from '@bull-board/nestjs'
import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { RedisModuleOptions } from '@nestjs-modules/ioredis'
import type { BullRootModuleOptions } from '@nestjs/bullmq'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { BcryptOptions } from 'hash-wasm'
import type { FormDataInterceptorConfig } from 'nestjs-form-data'

export class ConfigSchema {
  appName: string

  hash: {
    bcrypt?: Omit<BcryptOptions, 'password'>
  }

  jwt: JwtModuleOptions

  redis: RedisModuleOptions

  orm: MikroOrmModuleOptions

  bull: BullRootModuleOptions

  bullBoard: BullBoardModuleOptions

  formData?: FormDataInterceptorConfig
}
