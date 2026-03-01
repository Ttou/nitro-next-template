import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { RedisModuleOptions } from '../extends'

export class ConfigSchema {
  appName: string

  hash: {
    cost?: number
    salt?: string | Uint8Array
  }

  jwt: JwtModuleOptions

  redis: RedisModuleOptions

  orm: MikroOrmModuleOptions
}
