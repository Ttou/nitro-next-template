import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'
import { SysDeptEntity } from './sys-dept.entity.ts'
import { SysPostEntity } from './sys-post.entity.ts'
import { SysRoleEntity } from './sys-role.entity.ts'

const SysUserEntitySchema = defineEntity({
  name: 'SysUserEntity',
  tableName: 'sys_user',
  extends: BaseEntity,
  properties: {
    userName: p.string().unique(),
    nickName: p.string(),
    password: p.string(),
    email: p.string().nullable(),
    phone: p.string().nullable(),
    sex: p.string().nullable(),
    avatar: p.string().nullable(),
    isAvailable: p.enum(YesOrNoEnumValues),
    isDelete: p.enum(YesOrNoEnumValues),
    remark: p.string().nullable(),
    depts: () => p.manyToMany(SysDeptEntity)
      .inversedBy('users')
      .owner()
      .ref()
      .pivotTable('rel_user_dept')
      .joinColumn('user_id')
      .inverseJoinColumn('dept_id'),
    posts: () => p.manyToMany(SysPostEntity)
      .inversedBy('users')
      .owner()
      .ref()
      .pivotTable('rel_user_post')
      .joinColumn('user_id')
      .inverseJoinColumn('post_id'),
    roles: () => p.manyToMany(SysRoleEntity)
      .inversedBy('users')
      .owner()
      .ref()
      .pivotTable('rel_user_role')
      .joinColumn('user_id')
      .inverseJoinColumn('role_id'),
  },
})

export class SysUserEntity extends SysUserEntitySchema.class {}

SysUserEntitySchema.setClass(SysUserEntity)
