import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { CacheModuleOptions, CaptchaModuleOptions, RedisModuleOptions } from '../extends'

export class ConfigSchema {
  appName: string

  hash: {
    cost?: number
    salt?: string | Uint8Array
  }

  cache?: CacheModuleOptions

  captcha?: CaptchaModuleOptions

  jwt: JwtModuleOptions

  redis: RedisModuleOptions

  orm: MikroOrmModuleOptions
}
