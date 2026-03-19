import type { MultipartFile } from '@fastify/multipart'

export interface UploadFileResult {
  name: string
  path: string
  ext: string
  size: number
  checksum: string
}

export interface UploadOptions {
  dest: string
  maxFileSize?: number
  allowedExtensions?: string[]
  allowedMimeTypes?: string[]
  maxFiles?: number
  fileName?: (file: MultipartFile) => string
}

export interface UploadModuleOptions extends UploadOptions {
  dest: string
}
