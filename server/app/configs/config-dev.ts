import type { ConfigSchema } from './config-schema'
import { MySqlDriver } from '@mikro-orm/mysql'
import { registerAs } from '@nestjs/config'
import { SysConfigEntity, SysDeptEntity, SysDictDataEntity, SysDictTypeEntity, SysLangEntity, SysMenuEntity, SysOnlineEntity, SysPostEntity, SysRoleEntity, SysUserEntity } from '../entities'
import { OrmLogger } from '../loggers'

export default registerAs('', (): ConfigSchema => {
  const appName = 'nitro_template'

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
  }
})
