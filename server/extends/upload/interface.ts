import type { MultipartFile } from '@fastify/multipart'
import type { SetRequired } from 'type-fest'

export interface UploadFileResult {
  /**
   * 文件名
   */
  name: string
  /**
   * 文件路径
   */
  path: string
  /**
   * 文件扩展名
   */
  ext: string
  /**
   * 文件大小
   */
  size: number
  /**
   * 文件校验和
   */
  checksum: string
}

export interface UploadModuleOptions {
  /**
   * 上传文件的目录
   * @default './'
   */
  dest?: string
  /**
   * 最大文件大小
   * @default 5 * 1024 * 1024
   */
  maxFileSize?: number
  /**
   * 最大文件数量
   * @default 10
   */
  maxFiles?: number
  /**
   * MB 分子
   * @default 1024 * 1024
   */
  mbDivisor?: number
  /**
   * 自定义文件名
   * @default (file) => {uuidv4}.{ext}
   */
  fileName?: (file: MultipartFile) => string
  /**
   * 允许的文件扩展名
   * @default []
   */
  allowedExtensions?: string[]
  /**
   * 允许的文件 MIME 类型
   * @default []
   */
  allowedMimeTypes?: string[]
}

export interface MergedUploadOptions extends SetRequired<UploadModuleOptions, 'dest' | 'maxFileSize' | 'maxFiles' | 'mbDivisor' | 'fileName'> {

}
