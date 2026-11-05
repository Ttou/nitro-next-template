import type { ConfigType } from '@nestjs/config'
import type { MulterModuleOptions } from '@nestjs/platform-node'
import { tmpdir } from 'node:os'
import { extname, join } from 'node:path'
import { registerAs } from '@nestjs/config'
import multer from 'multer'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { generateId } from '~shared/utils'

function createDiskStorage(destination: string) {
  return multer.diskStorage({
    destination,
    filename: (_req, file, callback) => {
      // 保留原文件后缀
      callback(null, `${generateId()}${extname(file.originalname)}`)
    },
  })
}

export const MulterConfig = registerAs('multer', () => {
  const destination = match(APP_ENV)
    .returnType<string>()
    .with(AppEnvEnum.DEV, () => './uploads')
    .with(AppEnvEnum.PROD, () => join(tmpdir(), 'nestjs-tmp-storage'))
    .run()

  const options: MulterModuleOptions = {
    // busboy 默认按 latin1 解析文件名，会导致中文乱码
    defParamCharset: 'utf8',
    storage: createDiskStorage(destination),
  }

  return options
})

export type IMulterConfig = ConfigType<typeof MulterConfig>
