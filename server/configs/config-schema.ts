import type { BullBoardModuleOptions } from '@bull-board/nestjs'
import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { BullRootModuleOptions } from '@nestjs/bullmq'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { CacheModuleOptions, CaptchaModuleOptions, ExcelModuleOptions, HashModuleOptions, LoggerModuleOptions, LogoutModuleOptions, RedisModuleOptions, UploadModuleOptions } from '../extends'

export class ConfigSchema {
  appName: string

  logger?: LoggerModuleOptions

  logout: LogoutModuleOptions

  hash: HashModuleOptions

  cache: CacheModuleOptions

  captcha?: CaptchaModuleOptions

  jwt: JwtModuleOptions

  redis: RedisModuleOptions

  orm: MikroOrmModuleOptions

  bull: BullRootModuleOptions

  bullBoard: BullBoardModuleOptions

  upload?: UploadModuleOptions

  excel?: ExcelModuleOptions
}
