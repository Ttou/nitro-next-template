import type { IMenuTypeEnum, IYesOrNoEnum } from '~shared/enums'
import { Collection, Entity, Enum, ManyToMany, Property } from '@mikro-orm/core'
import { MenuTypeEnumValues, YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysRoleEntity } from './sys-role'

@Entity({ tableName: 'sys_menu' })
export class SysMenuEntity extends BaseEntity {
  @Property({ type: 'bigint', nullable: true })
  parentId?: bigint

  @Property()
  menuName: string

  @Property({ unique: true })
  menuKey: string

  @Enum({ items: () => MenuTypeEnumValues })
  menuType: IMenuTypeEnum

  @Property()
  orderNum: number

  @Property({ nullable: true })
  path?: string

  @Property({ nullable: true })
  component?: string

  @Property({ nullable: true })
  redirect?: string

  @Property({ nullable: true })
  icon?: string

  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @Enum({ items: () => YesOrNoEnumValues, nullable: true })
  isCache?: IYesOrNoEnum

  @Enum({ items: () => YesOrNoEnumValues, nullable: true })
  isFrame?: IYesOrNoEnum

  @Enum({ items: () => YesOrNoEnumValues, nullable: true })
  isVisible?: IYesOrNoEnum

  @Property({ nullable: true })
  remark?: string

  @ManyToMany(() => SysRoleEntity, role => role.menus)
  roles = new Collection<SysRoleEntity>(this)
}
