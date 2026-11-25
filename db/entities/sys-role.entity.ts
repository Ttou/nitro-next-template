import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'
import { SysDeptEntity } from './sys-dept.entity.ts'
import { SysMenuEntity } from './sys-menu.entity.ts'
import { SysUserEntity } from './sys-user.entity.ts'

const SysRoleEntitySchema = defineEntity({
  name: 'SysRoleEntity',
  tableName: 'sys_role',
  extends: BaseEntity,
  properties: {
    roleKey: p.string().unique(),
    roleName: p.string(),
    isAvailable: p.enum(YesOrNoEnumValues),
    remark: p.string().nullable(),
    depts: () => p.manyToMany(SysDeptEntity)
      .inversedBy('roles')
      .owner()
      .ref()
      .pivotTable('rel_role_dept')
      .joinColumn('role_id')
      .inverseJoinColumn('dept_id'),
    menus: () => p.manyToMany(SysMenuEntity)
      .inversedBy('roles')
      .owner()
      .ref()
      .pivotTable('rel_role_menu')
      .joinColumn('role_id')
      .inverseJoinColumn('menu_id'),
    users: () => p.manyToMany(SysUserEntity).mappedBy('roles'),
  },
})

export class SysRoleEntity extends SysRoleEntitySchema.class {}

SysRoleEntitySchema.setClass(SysRoleEntity)
