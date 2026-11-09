import type { IYesOrNoEnum } from '../../shared/enums/index.ts'
import { Collection } from '@mikro-orm/core'
import { Entity, Enum, ManyToMany, Property } from '@mikro-orm/decorators/legacy'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'
import { SysDeptEntity } from './sys-dept.entity.ts'
import { SysMenuEntity } from './sys-menu.entity.ts'
import { SysUserEntity } from './sys-user.entity.ts'

@Entity({ tableName: 'sys_role' })
export class SysRoleEntity extends BaseEntity {
  @Property({ type: 'string', unique: true })
  roleKey: string

  @Property({ type: 'string' })
  roleName: string

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
  })
  isAvailable: IYesOrNoEnum

  @Property({ type: 'string', nullable: true })
  remark?: INullable<string>

  @ManyToMany({
    entity: () => SysDeptEntity,
    inversedBy: dept => dept.roles,
    owner: true,
    ref: true,
    pivotTable: 'rel_role_dept',
    joinColumn: 'role_id',
    inverseJoinColumn: 'dept_id',
  })
  depts = new Collection<SysDeptEntity, SysRoleEntity>(this)

  @ManyToMany({
    entity: () => SysMenuEntity,
    inversedBy: menu => menu.roles,
    owner: true,
    ref: true,
    pivotTable: 'rel_role_menu',
    joinColumn: 'role_id',
    inverseJoinColumn: 'menu_id',
  })
  menus = new Collection<SysMenuEntity, SysRoleEntity>(this)

  @ManyToMany({
    entity: () => SysUserEntity,
    mappedBy: user => user.roles,
  })
  users = new Collection<SysUserEntity, SysRoleEntity>(this)
}
