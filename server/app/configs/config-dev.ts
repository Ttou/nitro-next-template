import type { ConfigSchema } from './config-schema'
import { ExpressAdapter } from '@bull-board/express'
import { MySqlDriver } from '@mikro-orm/mysql'
import { registerAs } from '@nestjs/config'
import basicAuth from 'express-basic-auth'
import { SysConfigEntity, SysDeptEntity, SysDictDataEntity, SysDictTypeEntity, SysLangEntity, SysMenuEntity, SysOnlineEntity, SysPostEntity, SysRoleEntity, SysUserEntity } from '../entities'
import { OrmLogger } from '../loggers'

export default registerAs('', (): ConfigSchema => {
  const appName = 'nitro_template'
  const redisKeyPrefixSeparator = ':'

  return {
    appName,
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
      entities: [
        SysConfigEntity,
        SysDeptEntity,
        SysDictDataEntity,
        SysDictTypeEntity,
        SysLangEntity,
        SysMenuEntity,
        SysPostEntity,
        SysRoleEntity,
        SysUserEntity,
        SysOnlineEntity,
      ],
      loggerFactory: options => new OrmLogger(options),
      debug: true,
    },
    jwt: {
      secret: '$2b$10$nxi79AIrqNBKgNVTcBnvQu==',
      signOptions: {
        expiresIn: '7d',
      },
    },
    hash: {
      salt: '$2b$10$v0UAl9V6T7OpZAlYZKvc5O==',
      cost: 10,
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
      adapter: ExpressAdapter,
      middleware: basicAuth({
        challenge: true,
        users: {
          bull: '123456',
        },
      }),
    },
  }
})
