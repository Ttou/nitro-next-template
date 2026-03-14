import type { ConfigSchema } from './config-schema'
import { mkdirSync } from 'node:fs'
import { basename, extname } from 'node:path'
import { ExpressAdapter } from '@bull-board/express'
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy'
import { MySqlDriver } from '@mikro-orm/mysql'
import { registerAs } from '@nestjs/config'
import basicAuth from 'express-basic-auth'
import { diskStorage } from 'multer'
import { SysConfigEntity, SysDeptEntity, SysDictDataEntity, SysDictTypeEntity, SysLangEntity, SysMenuEntity, SysOnlineEntity, SysOperateEntity, SysPostEntity, SysRoleEntity, SysUserEntity } from '../entities'

export default registerAs('', (): ConfigSchema => {
  const appName = 'nitro_template'
  const redisKeyPrefixSeparator = ':'

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
      metadataProvider: ReflectMetadataProvider,
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
        SysOperateEntity,
      ],
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
    multer: {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = './uploads'
          mkdirSync(uploadDir, { recursive: true })
          cb(null, uploadDir)
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
          const ext = extname(file.originalname)
          const nameWithoutExt = basename(file.originalname, ext)
          cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`)
        },
      }),
    },
  }
})
