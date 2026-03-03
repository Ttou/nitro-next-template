import type { BullBoardModuleOptions } from '@bull-board/nestjs'
import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { BullRootModuleOptions } from '@nestjs/bullmq'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { CacheModuleOptions, CaptchaModuleOptions, HashModuleOptions, RedisModuleOptions } from '../extends'

export class ConfigSchema {
  appName: string

  hash: HashModuleOptions

  cache: CacheModuleOptions

  captcha?: CaptchaModuleOptions

  jwt: JwtModuleOptions

  redis: RedisModuleOptions

  orm: MikroOrmModuleOptions

  bull: BullRootModuleOptions

  bullBoard: BullBoardModuleOptions
}
