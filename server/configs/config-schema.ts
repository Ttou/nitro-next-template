import type { BullBoardModuleOptions } from '@bull-board/nestjs'
import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { BullRootModuleOptions } from '@nestjs/bullmq'
import type { CacheModuleOptions, CaptchaModuleOptions, ExcelModuleOptions, HashModuleOptions, JwtModuleOptions, LogoutModuleOptions, RedisModuleOptions, UploadModuleOptions } from '../extends'

export class ConfigSchema {
  appName: string

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

  health: {
    middleware?: any
  }
}
