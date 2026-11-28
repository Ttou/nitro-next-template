import type { BullBoardModuleOptions } from '@bull-board/nestjs'
import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { RedisModuleOptions } from '@nestjs-modules/ioredis'
import type { BullRootModuleOptions } from '@nestjs/bullmq'
import type { StorageModuleOptions } from '@nestjs/storage'
import type { XltTokenModuleOptions } from '@xlt-token/nestjs'
import type { StringValue } from 'ms'
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

/**
 * 孤儿文件清理任务配置
 *
 * 「孤儿」包含两类：存储里存在但库里没有记录的对象，以及库里有记录但存储里已不存在的行。
 */
export interface IStorageCleanupConfig {
  /** 是否注册定时任务，默认 false（需显式开启） */
  enabled: boolean
  /** 执行间隔，vercel/ms 格式，如 `1d`、`6h` */
  every: StringValue
  /** 保留天数：早于该时间的孤儿才会被处理，给晚到的业务引用留缓冲 */
  retentionDays: number
  /** 只统计不删除，默认 true */
  dryRun: boolean
}

export interface IConfig {
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
  'storage-cleanup': IStorageCleanupConfig
  'xlt-token': XltTokenModuleOptions
}
