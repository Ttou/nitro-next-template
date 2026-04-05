import type { ConfigSchema } from './config-schema'
import { basename, dirname, extname, resolve } from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'
import { FastifyAdapter } from '@bull-board/fastify'
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy'
import { MySqlDriver } from '@mikro-orm/mysql'
import { registerAs } from '@nestjs/config'
import { basicAuth } from '~server/fastify'

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
    logger: {
      dateFile: {
        filename: resolve(cwd(), './logs/app.log'),
        pattern: '.yyyy-MM-dd',
        numBackups: 7,
        compress: true,
      },
    },
    orm: {
      metadataProvider: ReflectMetadataProvider,
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
      middleware: basicAuth({
        username: 'bull',
        password: '123456',
      }),
      boardOptions: {
        uiBasePath: dirname(resolve(__dirname, '../../node_modules/@bull-board/ui/package.json')),
      },
    },
    upload: {
      dest: './uploads',
      fileName: (file) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const ext = extname(file.filename)
        const nameWithoutExt = basename(file.filename, ext)
        return `${nameWithoutExt}-${uniqueSuffix}${ext}`
      },
    },
    excel: {
      cleanTempFile: true,
    },
    health: {
      middleware: basicAuth({
        username: 'health',
        password: '123456',
      }),
    },
  }
})
