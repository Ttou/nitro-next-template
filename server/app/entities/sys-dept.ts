import type { IYesOrNoEnum } from '~shared/enums'
import { Collection, Entity, Enum, ManyToMany, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysRoleEntity } from './sys-role'
import { SysUserEntity } from './sys-user'

@Entity({ tableName: 'sys_dept' })
export class SysDeptEntity extends BaseEntity {
  @ApiProperty({ description: '父部门ID' })
  @Property({ type: 'bigint', nullable: true })
  parentId?: bigint

  @ApiProperty({ description: '部门键值' })
  @Property({ unique: true })
  deptKey: string

  @ApiProperty({ description: '部门名称' })
  @Property()
  deptName: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  @Property({ nullable: true })
  remark?: string

  @ApiProperty({ description: '角色' })
  @ManyToMany(() => SysRoleEntity, role => role.depts)
  roles = new Collection<SysRoleEntity>(this)

  @ApiProperty({ description: '用户' })
  @ManyToMany(() => SysUserEntity, user => user.depts)
  users = new Collection<SysUserEntity>(this)
}
