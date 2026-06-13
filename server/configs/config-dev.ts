import type { ConfigSchema } from './config-schema'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FastifyAdapter } from '@bull-board/fastify'
import KeyvRedis from '@keyv/redis'
import { MySqlDriver } from '@mikro-orm/mysql'
import { registerAs } from '@nestjs/config'
import { getRedisUrl } from '~server/utils'

export default registerAs('', (): ConfigSchema => {
  const appName = 'nitro_template'
  const redisKeyPrefixSeparator = ':'
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const redisShared: ConfigSchema['redisShared'] = {
    host: '127.0.0.1',
    port: 6379,
    db: 0,
  }

  return {
    appName,
    redisShared,
    redis: {
      type: 'single',
      options: {
        ...redisShared,
      },
    },
    cache: {
      nonBlocking: true,
      stores: [
        new KeyvRedis(getRedisUrl(redisShared)),
      ],
    },
    orm: {
      driver: MySqlDriver,
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'root',
      dbName: 'nitro_template',
      debug: true,
    },
    hash: {
      bcrypt: {
        salt: '$2b$10$v0UAl9V6T7OpZAlYZKvc5O==',
        costFactor: 10,
      },
    },
    bull: {
      prefix: [appName, 'bull'].join(redisKeyPrefixSeparator),
      connection: {
        ...redisShared,
      },
    },
    bullBoard: {
      route: '/bull-ui',
      adapter: FastifyAdapter,
      boardOptions: {
        uiBasePath: dirname(resolve(__dirname, '../../node_modules/@bull-board/ui/package.json')),
      },
    },
    formData: {
      fileSystemStoragePath: './uploads',
    },
    xltToken: {
      defaultCheck: true,
      isReadHeader: true,
      timeout: '7d',
      jwt: {
        secret: '$2b$10$nxi79AIrqNBKgNVTcBnvQu==',
        algorithm: 'HS256',
        issuer: 'xlt-token',
      },
    },
  }
})
