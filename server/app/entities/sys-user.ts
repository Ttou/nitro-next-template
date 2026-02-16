import type { IYesOrNoEnum } from '~shared/enums'
import { Collection, Entity, Enum, ManyToMany, Property } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysDeptEntity } from './sys-dept'
import { SysPostEntity } from './sys-post'
import { SysRoleEntity } from './sys-role'

@Entity({ tableName: 'sys_user' })
export class SysUserEntity extends BaseEntity {
  @Property({ unique: true })
  userName: string

  @Property()
  nickName: string

  @Property()
  password: string

  @Property({ nullable: true })
  email?: string

  @Property({ nullable: true })
  phone?: string

  @Property({ nullable: true })
  sex?: string

  @Property({ nullable: true })
  avatar?: string

  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @Enum({ items: () => YesOrNoEnumValues })
  isDelete: IYesOrNoEnum

  @Property({ nullable: true })
  remark?: string

  @ManyToMany(() => SysDeptEntity, 'users', { owner: true, ref: true, pivotTable: 'rel_user_dept', joinColumn: 'user_id', inverseJoinColumn: 'dept_id' })
  depts = new Collection<SysDeptEntity>(this)

  @ManyToMany(() => SysPostEntity, 'users', { owner: true, ref: true, pivotTable: 'rel_user_post', joinColumn: 'user_id', inverseJoinColumn: 'post_id' })
  posts = new Collection<SysPostEntity>(this)

  @ManyToMany(() => SysRoleEntity, 'users', { owner: true, ref: true, pivotTable: 'rel_user_role', joinColumn: 'user_id', inverseJoinColumn: 'role_id' })
  roles = new Collection<SysRoleEntity>(this)
}
