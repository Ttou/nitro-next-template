import type { IPropertyNullable } from '~server/interfaces'
import type { IMenuTypeEnum, IYesOrNoEnum } from '~shared/enums'
import type { SysMenuEntity, SysRoleEntity } from '../entities'
import { Collection } from '@mikro-orm/core'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { MenuTypeEnumMap, YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'
import { SysRoleEntityDto } from './sys-role'

export class SysMenuEntityDto extends BaseEntityDto implements SysMenuEntity {
  @ApiProperty({ description: '父菜单ID' })
  parentId: IPropertyNullable<string>

  @ApiProperty({ description: '菜单名称' })
  menuName: string

  @ApiProperty({ description: '菜单键值' })
  menuKey: string

  @ApiProperty({ description: '菜单类型', enum: MenuTypeEnumMap })
  menuType: IMenuTypeEnum

  @ApiProperty({ description: '排序' })
  orderNum: number

  @ApiProperty({ description: '路径' })
  path: IPropertyNullable<string>

  @ApiProperty({ description: '组件' })
  component: IPropertyNullable<string>

  @ApiProperty({ description: '重定向' })
  redirect: IPropertyNullable<string>

  @ApiProperty({ description: '图标' })
  icon: IPropertyNullable<string>

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '是否缓存', enum: YesOrNoEnumMap })
  isCache: IPropertyNullable<IYesOrNoEnum>

  @ApiProperty({ description: '是否内嵌', enum: YesOrNoEnumMap })
  isFrame: IPropertyNullable<IYesOrNoEnum>

  @ApiProperty({ description: '是否显示', enum: YesOrNoEnumMap })
  isVisible: IPropertyNullable<IYesOrNoEnum>

  @ApiProperty({ description: '备注' })
  remark: IPropertyNullable<string>

  @ApiProperty({ description: '角色列表', type: () => [SysRoleEntityDto] })
  roles: Collection<SysRoleEntity, SysMenuEntity>
}

export class SysMenuEntityExcludeRelationDto extends OmitType(SysMenuEntityDto, ['roles'] as const) {}
