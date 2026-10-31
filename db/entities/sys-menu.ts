import type { IMenuTypeEnum, IYesOrNoEnum } from '../../shared/enums/index.ts'
import { Collection } from '@mikro-orm/core'
import { Entity, Enum, ManyToMany, Property } from '@mikro-orm/decorators/legacy'
import { MenuTypeEnumValues, YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.ts'
import { SysRoleEntity } from './sys-role.ts'

@Entity({ tableName: 'sys_menu' })
export class SysMenuEntity extends BaseEntity {
  @Property({ type: 'string', nullable: true })
  parentId?: INullable<string>

  @Property({ type: 'string' })
  menuName: string

  @Property({ type: 'string', unique: true })
  menuKey: string

  @Enum({
    items: () => MenuTypeEnumValues,
    type: 'string',
  })
  menuType: IMenuTypeEnum

  @Property({ type: 'integer' })
  orderNum: number

  @Property({ type: 'string', nullable: true })
  path?: INullable<string>

  @Property({ type: 'string', nullable: true })
  component?: INullable<string>

  @Property({ type: 'string', nullable: true })
  redirect?: INullable<string>

  @Property({ type: 'string', nullable: true })
  icon?: INullable<string>

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
  })
  isAvailable: IYesOrNoEnum

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
    nullable: true,
  })
  isCache?: INullable<IYesOrNoEnum>

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
    nullable: true,
  })
  isFrame?: INullable<IYesOrNoEnum>

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
    nullable: true,
  })
  isVisible?: INullable<IYesOrNoEnum>

  @Property({ type: 'string', nullable: true })
  remark?: INullable<string>

  @ManyToMany({
    entity: () => SysRoleEntity,
    mappedBy: role => role.menus,
  })
  roles = new Collection<SysRoleEntity, SysMenuEntity>(this)
}
