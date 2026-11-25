import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'
import { SysUserEntity } from './sys-user.entity.ts'

const SysPostEntitySchema = defineEntity({
  name: 'SysPostEntity',
  tableName: 'sys_post',
  extends: BaseEntity,
  properties: {
    postKey: p.string().unique(),
    postName: p.string(),
    isAvailable: p.enum(YesOrNoEnumValues),
    remark: p.string().nullable(),
    users: () => p.manyToMany(SysUserEntity).mappedBy('posts'),
  },
})

export class SysPostEntity extends SysPostEntitySchema.class {}

SysPostEntitySchema.setClass(SysPostEntity)
