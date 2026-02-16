import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { RedisOptions } from 'ioredis'

export class ConfigSchema {
  appName: string

  hash: {
    cost?: number
    salt?: string | Uint8Array
  }

  jwt: JwtModuleOptions

  redis: RedisOptions

  orm: MikroOrmModuleOptions
}
