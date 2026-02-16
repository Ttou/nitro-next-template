import { Collection, Entity, Enum, ManyToMany, Property } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysUserEntity } from './sys-user'

@Entity({ tableName: 'sys_post' })
export class SysPostEntity extends BaseEntity {
  @Property({ unique: true })
  postKey: string

  @Property()
  postName: string

  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @Property({ nullable: true })
  remark?: string

  @ManyToMany(() => SysUserEntity, user => user.posts)
  users = new Collection<SysUserEntity>(this)
}
