import type { IYesOrNoEnum } from '../../shared/enums/index.ts'
import { Collection } from '@mikro-orm/core'
import { Entity, Enum, ManyToMany, Property } from '@mikro-orm/decorators/legacy'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.ts'
import { SysDeptEntity } from './sys-dept.ts'
import { SysPostEntity } from './sys-post.ts'
import { SysRoleEntity } from './sys-role.ts'

@Entity({ tableName: 'sys_user' })
export class SysUserEntity extends BaseEntity {
  @Property({ type: 'string', unique: true })
  userName: string

  @Property({ type: 'string' })
  nickName: string

  @Property({ type: 'string' })
  password: string

  @Property({ type: 'string', nullable: true })
  email?: INullable<string>

  @Property({ type: 'string', nullable: true })
  phone?: INullable<string>

  @Property({ type: 'string', nullable: true })
  sex?: INullable<string>

  @Property({ type: 'string', nullable: true })
  avatar?: INullable<string>

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
  })
  isAvailable: IYesOrNoEnum

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
  })
  isDelete: IYesOrNoEnum

  @Property({ type: 'string', nullable: true })
  remark?: INullable<string>

  @ManyToMany({
    entity: () => SysDeptEntity,
    inversedBy: dept => dept.users,
    owner: true,
    ref: true,
    pivotTable: 'rel_user_dept',
    joinColumn: 'user_id',
    inverseJoinColumn: 'dept_id',
  })
  depts = new Collection<SysDeptEntity, SysUserEntity>(this)

  @ManyToMany({
    entity: () => SysPostEntity,
    inversedBy: post => post.users,
    owner: true,
    ref: true,
    pivotTable: 'rel_user_post',
    joinColumn: 'user_id',
    inverseJoinColumn: 'post_id',
  })
  posts = new Collection<SysPostEntity, SysUserEntity>(this)

  @ManyToMany({
    entity: () => SysRoleEntity,
    inversedBy: role => role.users,
    owner: true,
    ref: true,
    pivotTable: 'rel_user_role',
    joinColumn: 'user_id',
    inverseJoinColumn: 'role_id',
  })
  roles = new Collection<SysRoleEntity, SysUserEntity>(this)
}
