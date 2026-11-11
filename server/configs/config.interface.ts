import type { BullBoardModuleOptions } from '@bull-board/nestjs'
import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { RedisModuleOptions } from '@nestjs-modules/ioredis'
import type { BullRootModuleOptions } from '@nestjs/bullmq'
import type { StorageModuleOptions } from '@nestjs/storage'
import type { XltTokenModuleOptions } from '@xlt-token/nestjs'
import type { ClsModuleFactoryOptions } from 'nestjs-cls'
import type { Params as LoggerModuleOptions } from 'nestjs-pino'
import type { AlovaModuleOptions } from '~nestjs-modules/alova'
import type { CacheModuleOptions } from '~nestjs-modules/cache'
import type { CaptchaModuleOptions } from '~nestjs-modules/captcha'
import type { ExcelModuleOptions } from '~nestjs-modules/excel'
import type { HashModuleOptions } from '~nestjs-modules/hash'

export interface ISharedConfig {
  appName: string
  basicAuth: {
    user: string
    pass: string
  }
  redis: {
    host: string
    port: number
    db: number
  }
}

export interface IAuthConfig {
  publicKey: string
  privateKey: string
}

export interface IConfig {
  'shared': ISharedConfig
  'auth': IAuthConfig
  'alova': AlovaModuleOptions
  'bull': BullRootModuleOptions
  'bull-board': BullBoardModuleOptions
  'cache': CacheModuleOptions
  'captcha': CaptchaModuleOptions
  'cls': ClsModuleFactoryOptions
  'excel': ExcelModuleOptions
  'hash': HashModuleOptions
  'logger': LoggerModuleOptions
  'mikro-orm': MikroOrmModuleOptions
  'redis': RedisModuleOptions
  'storage': StorageModuleOptions
  'xlt-token': XltTokenModuleOptions
}
