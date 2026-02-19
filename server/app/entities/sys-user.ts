import type { IYesOrNoEnum } from '~shared/enums'
import { Collection, Entity, Enum, ManyToMany, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysDeptEntity } from './sys-dept'
import { SysPostEntity } from './sys-post'
import { SysRoleEntity } from './sys-role'

@Entity({ tableName: 'sys_user' })
export class SysUserEntity extends BaseEntity {
  @ApiProperty({ description: '账号' })
  @Property({ unique: true })
  userName: string

  @ApiProperty({ description: '昵称' })
  @Property()
  nickName: string

  @ApiProperty({ description: '密码' })
  @Property()
  password: string

  @ApiProperty({ description: '邮箱' })
  @Property({ nullable: true })
  email?: string

  @ApiProperty({ description: '手机号码' })
  @Property({ nullable: true })
  phone?: string

  @ApiProperty({ description: '性别' })
  @Property({ nullable: true })
  sex?: string

  @ApiProperty({ description: '头像' })
  @Property({ nullable: true })
  avatar?: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '是否删除', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues })
  isDelete: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  @Property({ nullable: true })
  remark?: string

  @ApiProperty({ description: '部门列表', type: () => [SysDeptEntity] })
  @ManyToMany(() => SysDeptEntity, 'users', { owner: true, ref: true, pivotTable: 'rel_user_dept', joinColumn: 'user_id', inverseJoinColumn: 'dept_id' })
  depts = new Collection<SysDeptEntity>(this)

  @ApiProperty({ description: '岗位列表', type: () => [SysPostEntity] })
  @ManyToMany(() => SysPostEntity, 'users', { owner: true, ref: true, pivotTable: 'rel_user_post', joinColumn: 'user_id', inverseJoinColumn: 'post_id' })
  posts = new Collection<SysPostEntity>(this)

  @ApiProperty({ description: '角色列表', type: () => [SysRoleEntity] })
  @ManyToMany(() => SysRoleEntity, 'users', { owner: true, ref: true, pivotTable: 'rel_user_role', joinColumn: 'user_id', inverseJoinColumn: 'role_id' })
  roles = new Collection<SysRoleEntity>(this)
}
