import type { IYesOrNoEnum } from '../../shared/enums'
import { Collection } from '@mikro-orm/core'
import { Entity, Enum, ManyToMany, Property } from '@mikro-orm/decorators/legacy'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.ts'
import { SysRoleEntity } from './sys-role.ts'
import { SysUserEntity } from './sys-user.ts'

@Entity({ tableName: 'sys_dept' })
export class SysDeptEntity extends BaseEntity {
  @Property({ type: 'string', nullable: true })
  parentId?: INullable<string>

  @Property({ type: 'string', unique: true })
  deptKey: string

  @Property({ type: 'string' })
  deptName: string

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
  })
  isAvailable: IYesOrNoEnum

  @Property({ type: 'string', nullable: true })
  remark?: INullable<string>

  @ManyToMany({
    entity: () => SysRoleEntity,
    mappedBy: role => role.depts,
  })
  roles = new Collection<SysRoleEntity, SysDeptEntity>(this)

  @ManyToMany({
    entity: () => SysUserEntity,
    mappedBy: user => user.depts,
  })
  users = new Collection<SysUserEntity, SysDeptEntity>(this)
}
