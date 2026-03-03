import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { CacheModuleOptions, CaptchaModuleOptions, HashModuleOptions, RedisModuleOptions } from '../extends'

export class ConfigSchema {
  appName: string

  hash: HashModuleOptions

  cache?: CacheModuleOptions

  captcha?: CaptchaModuleOptions

  jwt: JwtModuleOptions

  redis: RedisModuleOptions

  orm: MikroOrmModuleOptions
}
