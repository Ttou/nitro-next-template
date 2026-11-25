import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'
import { SysRoleEntity } from './sys-role.entity.ts'
import { SysUserEntity } from './sys-user.entity.ts'

const SysDeptEntitySchema = defineEntity({
  name: 'SysDeptEntity',
  tableName: 'sys_dept',
  extends: BaseEntity,
  properties: {
    parentId: p.string().nullable(),
    deptKey: p.string().unique(),
    deptName: p.string(),
    isAvailable: p.enum(YesOrNoEnumValues),
    remark: p.string().nullable(),
    roles: () => p.manyToMany(SysRoleEntity).mappedBy('depts'),
    users: () => p.manyToMany(SysUserEntity).mappedBy('depts'),
  },
})

export class SysDeptEntity extends SysDeptEntitySchema.class {}

SysDeptEntitySchema.setClass(SysDeptEntity)
