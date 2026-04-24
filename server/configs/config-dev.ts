import type { ConfigSchema } from './config-schema'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FastifyAdapter } from '@bull-board/fastify'
import { MySqlDriver } from '@mikro-orm/mysql'
import { registerAs } from '@nestjs/config'

export default registerAs('', (): ConfigSchema => {
  const appName = 'nitro_template'
  const redisKeyPrefixSeparator = ':'
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  return {
    appName,
    logout: {
      keyPrefix: [appName, 'logout'].join(redisKeyPrefixSeparator),
      keyPrefixSeparator: redisKeyPrefixSeparator,
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
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
    jwt: {
      secret: '$2b$10$nxi79AIrqNBKgNVTcBnvQu==',
      signOptions: {
        expiresIn: '15d',
        algorithm: 'HS256',
      },
    },
    hash: {
      salt: '$2b$10$v0UAl9V6T7OpZAlYZKvc5O==',
    },
    cache: {
      keyPrefix: [appName, 'cache'].join(redisKeyPrefixSeparator),
      keyPrefixSeparator: redisKeyPrefixSeparator,
    },
    bull: {
      prefix: [appName, 'bull'].join(redisKeyPrefixSeparator),
      connection: {
        host: '127.0.0.1',
        port: 6379,
        db: 0,
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
    excel: {
      cleanTempFile: true,
    },
  }
})
