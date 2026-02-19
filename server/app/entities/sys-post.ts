import type { IYesOrNoEnum } from '~shared/enums'
import { Collection, Entity, Enum, ManyToMany, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysUserEntity } from './sys-user'

@Entity({ tableName: 'sys_post' })
export class SysPostEntity extends BaseEntity {
  @ApiProperty({ description: '岗位键值' })
  @Property({ unique: true })
  postKey: string

  @ApiProperty({ description: '岗位名称' })
  @Property()
  postName: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  @Property({ nullable: true })
  remark?: string

  @ApiProperty({ description: '用户列表', type: () => [SysUserEntity] })
  @ManyToMany(() => SysUserEntity, user => user.posts)
  users = new Collection<SysUserEntity>(this)
}
