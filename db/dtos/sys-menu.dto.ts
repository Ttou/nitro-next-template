import type { Collection } from '@mikro-orm/core'
import type { IMenuTypeEnum, IYesOrNoEnum } from '~shared/enums'
import type { SysMenuEntity, SysRoleEntity } from '../entities'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { MenuTypeEnumMap, YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base.dto'
import { SysRoleEntityDto } from './sys-role.dto'

export class SysMenuEntityDto extends BaseEntityDto implements SysMenuEntity {
  @ApiProperty({ description: '父菜单ID' })
  parentId?: INullable<string>

  @ApiProperty({ description: '菜单名称' })
  menuName: string

  @ApiProperty({ description: '菜单键值' })
  menuKey: string

  @ApiProperty({ description: '菜单类型', enum: MenuTypeEnumMap })
  menuType: IMenuTypeEnum

  @ApiProperty({ description: '排序' })
  orderNum: number

  @ApiProperty({ description: '路径' })
  path?: INullable<string>

  @ApiProperty({ description: '组件' })
  component?: INullable<string>

  @ApiProperty({ description: '重定向' })
  redirect?: INullable<string>

  @ApiProperty({ description: '图标' })
  icon?: INullable<string>

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '是否缓存', enum: YesOrNoEnumMap })
  isCache?: INullable<IYesOrNoEnum>

  @ApiProperty({ description: '是否内嵌', enum: YesOrNoEnumMap })
  isFrame?: INullable<IYesOrNoEnum>

  @ApiProperty({ description: '是否显示', enum: YesOrNoEnumMap })
  isVisible?: INullable<IYesOrNoEnum>

  @ApiProperty({ description: '备注' })
  remark?: INullable<string>

  @ApiProperty({
    description: '角色列表',
    type: () => [SysRoleEntityDto],
  })
  roles: Collection<SysRoleEntity, SysMenuEntity>
}

export class SysMenuEntityExcludeRelationDto extends OmitType(SysMenuEntityDto, ['roles'] as const) {}
