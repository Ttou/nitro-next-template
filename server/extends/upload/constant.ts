import type { MergedUploadOptions } from './interface'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'

export const defaultOptions: MergedUploadOptions = {
  dest: './',
  maxFileSize: 1024 * 1024 * 10,
  maxFiles: 10,
  mbDivisor: 1024 * 1024,
  fileName: (file) => {
    const ext = extname(file.filename).toLowerCase()
    return `${randomUUID()}${ext}`
  },
}
