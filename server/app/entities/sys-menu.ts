import type { IMenuTypeEnum, IYesOrNoEnum } from '~shared/enums'
import { Collection, Entity, Enum, ManyToMany, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { MenuTypeEnumMap, MenuTypeEnumValues, YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'
import { SysRoleEntity } from './sys-role'

@Entity({ tableName: 'sys_menu' })
export class SysMenuEntity extends BaseEntity {
  @ApiProperty({ description: '父菜单ID' })
  @Property({ type: 'bigint', nullable: true })
  parentId?: bigint

  @ApiProperty({ description: '菜单名称' })
  @Property()
  menuName: string

  @ApiProperty({ description: '菜单键值' })
  @Property({ unique: true })
  menuKey: string

  @ApiProperty({ description: '菜单类型', enum: MenuTypeEnumMap })
  @Enum({ items: () => MenuTypeEnumValues })
  menuType: IMenuTypeEnum

  @ApiProperty({ description: '排序' })
  @Property()
  orderNum: number

  @ApiProperty({ description: '路径' })
  @Property({ nullable: true })
  path?: string

  @ApiProperty({ description: '组件' })
  @Property({ nullable: true })
  component?: string

  @ApiProperty({ description: '重定向' })
  @Property({ nullable: true })
  redirect?: string

  @ApiProperty({ description: '图标' })
  @Property({ nullable: true })
  icon?: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '是否缓存', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues, nullable: true })
  isCache?: IYesOrNoEnum

  @ApiProperty({ description: '是否内嵌', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues, nullable: true })
  isFrame?: IYesOrNoEnum

  @ApiProperty({ description: '是否显示', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues, nullable: true })
  isVisible?: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  @Property({ nullable: true })
  remark?: string

  @ApiProperty({ description: '角色列表', type: () => [SysRoleEntity] })
  @ManyToMany(() => SysRoleEntity, role => role.menus)
  roles = new Collection<SysRoleEntity>(this)
}
