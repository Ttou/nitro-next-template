import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysDeptEntity } from './sys-dept'
import { SysPostEntity } from './sys-post'
import { SysRoleEntity } from './sys-role'

const SysUserSchema = defineEntity({
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
    isAvailable: p.enum(() => YesOrNoEnumValues),
    isDelete: p.enum(() => YesOrNoEnumValues),
    remark: p.string().nullable(),
    depts: () => p.manyToMany(SysDeptEntity).mappedBy(dept => dept.users).owner().ref().pivotTable('rel_user_dept').joinColumn('user_id').inverseJoinColumn('dept_id'),
    posts: () => p.manyToMany(SysPostEntity).mappedBy(post => post.users).owner().ref().pivotTable('rel_user_post').joinColumn('user_id').inverseJoinColumn('post_id'),
    roles: () => p.manyToMany(SysRoleEntity).mappedBy(role => role.users).owner().ref().pivotTable('rel_user_role').joinColumn('user_id').inverseJoinColumn('role_id'),
  },
})

export class SysUserEntity extends SysUserSchema.class {}

SysUserSchema.setClass(SysUserEntity)
