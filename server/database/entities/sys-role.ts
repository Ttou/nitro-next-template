import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysDeptEntity } from './sys-dept'
import { SysMenuEntity } from './sys-menu'
import { SysUserEntity } from './sys-user'

const SysRoleSchema = defineEntity({
  name: 'SysRoleEntity',
  tableName: 'sys_role',
  extends: BaseEntity,
  properties: {
    roleKey: p.string().unique(),
    roleName: p.string(),
    isAvailable: p.enum(() => YesOrNoEnumValues),
    remark: p.string().nullable(),
    depts: () => p.manyToMany(SysDeptEntity).mappedBy(dept => dept.roles).owner().ref().pivotTable('rel_role_dept').joinColumn('role_id').inverseJoinColumn('dept_id'),
    menus: () => p.manyToMany(SysMenuEntity).mappedBy(menu => menu.roles).owner().ref().pivotTable('rel_role_menu').joinColumn('role_id').inverseJoinColumn('menu_id'),
    users: () => p.manyToMany(SysUserEntity).mappedBy(user => user.roles),
  },
})

export class SysRoleEntity extends SysRoleSchema.class {}

SysRoleSchema.setClass(SysRoleEntity)
