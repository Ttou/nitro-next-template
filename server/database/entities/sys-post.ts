import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysUserEntity } from './sys-user'

const SysPostSchema = defineEntity({
  name: 'SysPostEntity',
  tableName: 'sys_post',
  extends: BaseEntity,
  properties: {
    postKey: p.string().unique(),
    postName: p.string(),
    isAvailable: p.enum(() => YesOrNoEnumValues),
    remark: p.string().nullable(),
    users: () => p.manyToMany(SysUserEntity).mappedBy(user => user.posts),
  },
})

export class SysPostEntity extends SysPostSchema.class {}

SysPostSchema.setClass(SysPostEntity)
