import { defineEntity, p } from '@mikro-orm/core'
import { StorageBizEnumValues, StorageVisibilityEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'

const SysStorageFileEntitySchema = defineEntity({
  name: 'SysStorageFileEntity',
  tableName: 'sys_storage_file',
  extends: BaseEntity,
  properties: {
    key: p.string().unique(),
    visibility: p.enum(StorageVisibilityEnumValues),
    biz: p.enum(StorageBizEnumValues),
    originalName: p.string(),
    contentType: p.string(),
    size: p.integer(),
    ownerId: p.string().index(),
  },
})

export class SysStorageFileEntity extends SysStorageFileEntitySchema.class {}

SysStorageFileEntitySchema.setClass(SysStorageFileEntity)
