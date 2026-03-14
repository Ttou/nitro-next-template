import type { BullBoardModuleOptions } from '@bull-board/nestjs'
import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { BullRootModuleOptions } from '@nestjs/bullmq'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { MulterModuleOptions } from '@nestjs/platform-express'
import type { CacheModuleOptions, CaptchaModuleOptions, HashModuleOptions, LogoutModuleOptions, RedisModuleOptions } from '../extends'

export class ConfigSchema {
  appName: string

  healthBasicAuth: any

  logout: LogoutModuleOptions

  hash: HashModuleOptions

  cache: CacheModuleOptions

  captcha?: CaptchaModuleOptions

  jwt: JwtModuleOptions

  redis: RedisModuleOptions

  orm: MikroOrmModuleOptions

  bull: BullRootModuleOptions

  bullBoard: BullBoardModuleOptions

  multer?: MulterModuleOptions
}
