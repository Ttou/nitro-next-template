import type { StoredUpload } from '@nestjs/storage'
import type { StorageUploadQueryDto } from '~shared/dtos'
import { EntityManager } from '@mikro-orm/mysql'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { SysStorageFileEntity } from '~db/entities'
import { s3Disk } from '~server/configs'
import { ContextService } from '~server/context'
import { ErrorEnum } from '~server/enums'
import { StorageVisibilityEnum } from '~shared/enums'

/** 私密文件签名地址有效期（秒） */
const SIGNED_URL_EXPIRES_IN = 300

@Injectable()
export class StorageService {
  constructor(
    private em: EntityManager,
    private contextService: ContextService,
  ) {}

  async upload(file: StoredUpload, dto: StorageUploadQueryDto) {
    const record = this.em.create(SysStorageFileEntity, {
      key: file.key,
      visibility: dto.visibility,
      biz: dto.biz,
      originalName: file.originalname,
      contentType: file.contentType,
      size: file.size,
      ownerId: this.contextService.getCurrentUser().id,
    })
    this.contextService.bindCurrentUserToEntity(record, 'create')

    try {
      await this.em.persist(record).flush()
    }
    catch (error) {
      // 记录写入失败时回收已落盘的对象，避免孤儿文件
      await s3Disk.delete(file.key).catch(() => {})
      throw error
    }

    return {
      id: record.id,
      key: record.key,
      visibility: record.visibility,
      url: record.visibility === StorageVisibilityEnum.PUBLIC
        ? s3Disk.url(record.key)
        : null,
    }
  }

  async getFileUrl(id: string) {
    const record = await this.em.findOne(SysStorageFileEntity, {
      id: { $eq: id },
    })

    if (!record) {
      throw new NotFoundException(ErrorEnum.label(ErrorEnum.STORAGE_FILE_NOT_FOUND_ERROR))
    }

    if (record.visibility === StorageVisibilityEnum.PUBLIC) {
      return {
        url: s3Disk.url(record.key),
        expiresIn: null,
      }
    }

    if (record.ownerId !== this.contextService.getCurrentUser().id) {
      throw new ForbiddenException(ErrorEnum.label(ErrorEnum.FORBIDDEN_ERROR))
    }

    const inline = record.contentType.startsWith('image/') || record.contentType === 'application/pdf'
    const url = await s3Disk.signedUrl(record.key, {
      expiresIn: `${SIGNED_URL_EXPIRES_IN}s`,
      disposition: inline ? 'inline' : 'attachment',
      filename: record.originalName,
    })

    return { url, expiresIn: SIGNED_URL_EXPIRES_IN }
  }
}
