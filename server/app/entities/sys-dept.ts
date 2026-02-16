import type { IYesOrNoEnum } from '~shared/enums'
import { Collection, Entity, Enum, ManyToMany, Property } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysRoleEntity } from './sys-role'
import { SysUserEntity } from './sys-user'

@Entity({ tableName: 'sys_dept' })
export class SysDeptEntity extends BaseEntity {
  @Property({ type: 'bigint', nullable: true })
  parentId?: bigint

  @Property({ unique: true })
  deptKey: string

  @Property()
  deptName: string

  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @Property({ nullable: true })
  remark?: string

  @ManyToMany(() => SysRoleEntity, role => role.depts)
  roles = new Collection<SysRoleEntity>(this)

  @ManyToMany(() => SysUserEntity, user => user.depts)
  users = new Collection<SysUserEntity>(this)
}
