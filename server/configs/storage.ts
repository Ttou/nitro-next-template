import type { ConfigType } from '@nestjs/config'
import type { StorageModuleOptions } from '@nestjs/storage'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { registerAs } from '@nestjs/config'
import { LocalDisk } from '@nestjs/storage'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'

const root = match(APP_ENV)
  .returnType<string>()
  .with(AppEnvEnum.DEV, () => './uploads')
  .with(AppEnvEnum.PROD, () => join(tmpdir(), 'nestjs-tmp-storage'))
  .run()

/**
 * 默认 local 磁盘实例。uploadToDisk 按磁盘名解析时依赖按 HTTP server 实例建立的注册表，
 * 而 dev 环境应用只 app.init() 不 listen、请求由 nitro 服务器处理，注册表无法命中，
 * 因此上传处需直接传入该实例
 */
export const localDisk = new LocalDisk({ root })

export const StorageConfig = registerAs('storage', (): StorageModuleOptions => {
  return {
    default: 'local',
    disks: {
      local: localDisk,
    },
  }
})

export type IStorageConfig = ConfigType<typeof StorageConfig>
