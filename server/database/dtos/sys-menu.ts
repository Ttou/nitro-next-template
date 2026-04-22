import type { IMenuTypeEnum, IYesOrNoEnum } from '~shared/enums'
import type { SysMenuEntity } from '../entities'
import { Collection } from '@mikro-orm/core'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { MenuTypeEnumMap, YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'
import { SysRoleEntityDto } from './sys-role'

export class SysMenuEntityDto extends BaseEntityDto implements SysMenuEntity {
  @ApiProperty({ description: '父菜单ID' })
  parentId?: string

  @ApiProperty({ description: '菜单名称' })
  menuName: string

  @ApiProperty({ description: '菜单键值' })
  menuKey: string

  @ApiProperty({ description: '菜单类型', enum: MenuTypeEnumMap })
  menuType: IMenuTypeEnum

  @ApiProperty({ description: '排序' })
  orderNum: number

  @ApiProperty({ description: '路径' })
  path?: string

  @ApiProperty({ description: '组件' })
  component?: string

  @ApiProperty({ description: '重定向' })
  redirect?: string

  @ApiProperty({ description: '图标' })
  icon?: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '是否缓存', enum: YesOrNoEnumMap })
  isCache?: IYesOrNoEnum

  @ApiProperty({ description: '是否内嵌', enum: YesOrNoEnumMap })
  isFrame?: IYesOrNoEnum

  @ApiProperty({ description: '是否显示', enum: YesOrNoEnumMap })
  isVisible?: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark?: string

  @ApiProperty({ description: '角色列表', type: () => [SysRoleEntityDto] })
  roles: Collection<SysRoleEntityDto, SysMenuEntityDto>
}

export class SysMenuEntityExcludeRelationDto extends OmitType(SysMenuEntityDto, ['roles'] as const) {}
