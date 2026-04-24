import type { ParticleStoredFile } from 'nestjs-form-data/dist/interfaces/ParticleStoredFile'
import { Readable } from 'node:stream'
import { FileSystemStoredFile } from 'nestjs-form-data'

export class CustomStoredFile extends FileSystemStoredFile {
  static override async create(
    meta: ParticleStoredFile,
    stream: Readable,
    storageConfig: Record<string, any>,
  ): Promise<CustomStoredFile> {
    // 修复 busboy 默认将非 ASCII 字符按 latin1 解码，导致中文字符显示为乱码
    meta.originalName = Buffer.from(meta.originalName, 'latin1').toString('utf8')

    const instance = await super.create(meta, stream, storageConfig) as CustomStoredFile

    return instance
  }
}
