import type { BullBoardModuleOptions } from '@bull-board/nestjs'
import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { BullRootModuleOptions } from '@nestjs/bullmq'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { FormDataInterceptorConfig } from 'nestjs-form-data'
import type { CacheModuleOptions, CaptchaModuleOptions, ExcelModuleOptions, HashModuleOptions, LogoutModuleOptions, RedisModuleOptions } from '../extends'

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

  formData?: FormDataInterceptorConfig

  excel?: ExcelModuleOptions
}
