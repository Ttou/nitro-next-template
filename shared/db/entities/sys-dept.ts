import type { InferEntity } from '@mikro-orm/core'
import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../enums'
import { BaseEntity } from './base'
import { SysRoleEntity } from './sys-role'
import { SysUserEntity } from './sys-user'

export const SysDeptEntity = defineEntity({
  name: 'SysDeptEntity',
  tableName: 'sys_dept',
  extends: BaseEntity,
  properties: {
    parentId: p.string().nullable(),
    deptKey: p.string().unique(),
    deptName: p.string(),
    isAvailable: p.enum(() => YesOrNoEnumValues),
    remark: p.string().nullable(),
    roles: () => p
      .manyToMany(SysRoleEntity)
      .mappedBy(role => role.depts),
    users: () => p
      .manyToMany(SysUserEntity)
      .mappedBy(user => user.depts),
  },
})

export type ISysDeptEntity = InferEntity<typeof SysDeptEntity>
