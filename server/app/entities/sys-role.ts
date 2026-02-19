import type { IYesOrNoEnum } from '~shared/enums'
import { Collection, Entity, Enum, ManyToMany, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysDeptEntity } from './sys-dept'
import { SysMenuEntity } from './sys-menu'
import { SysUserEntity } from './sys-user'

@Entity({ tableName: 'sys_role' })
export class SysRoleEntity extends BaseEntity {
  @ApiProperty({ description: '角色键值' })
  @Property({ unique: true })
  roleKey: string

  @ApiProperty({ description: '角色名称' })
  @Property()
  roleName: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  @Property({ nullable: true })
  remark?: string

  @ApiProperty({ description: '部门列表', type: () => [SysDeptEntity] })
  @ManyToMany(() => SysDeptEntity, 'roles', { owner: true, ref: true, pivotTable: 'rel_role_dept', joinColumn: 'role_id', inverseJoinColumn: 'dept_id' })
  depts = new Collection<SysDeptEntity>(this)

  @ApiProperty({ description: '菜单列表', type: () => [SysMenuEntity] })
  @ManyToMany(() => SysMenuEntity, 'roles', { owner: true, ref: true, pivotTable: 'rel_role_menu', joinColumn: 'role_id', inverseJoinColumn: 'menu_id' })
  menus = new Collection<SysMenuEntity>(this)

  @ApiProperty({ description: '用户列表', type: () => [SysUserEntity] })
  @ManyToMany(() => SysUserEntity, user => user.roles)
  users = new Collection<SysUserEntity>(this)
}
