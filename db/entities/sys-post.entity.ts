import type { IYesOrNoEnum } from '../../shared/enums/index.ts'
import { Collection } from '@mikro-orm/core'
import { Entity, Enum, ManyToMany, Property } from '@mikro-orm/decorators/legacy'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'
import { SysUserEntity } from './sys-user.entity.ts'

@Entity({ tableName: 'sys_post' })
export class SysPostEntity extends BaseEntity {
  @Property({ type: 'string', unique: true })
  postKey: string

  @Property({ type: 'string' })
  postName: string

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
  })
  isAvailable: IYesOrNoEnum

  @Property({ type: 'string', nullable: true })
  remark?: INullable<string>

  @ManyToMany({
    entity: () => SysUserEntity,
    mappedBy: user => user.posts,
  })
  users = new Collection<SysUserEntity, SysPostEntity>(this)
}
