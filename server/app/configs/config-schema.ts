import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'

export class ConfigSchema {
  appName: string

  hash: {
    cost?: number
    salt?: string | Uint8Array
  }

  orm: MikroOrmModuleOptions
}
