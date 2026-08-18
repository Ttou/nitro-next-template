import type { ISysDeptEntity, ISysMenuEntity, ISysRoleEntity, ISysUserEntity } from '~db/entities'
import type { IPropertyNullable } from '~server/interfaces'
import type { IYesOrNoEnum } from '~shared/enums'
import { Collection } from '@mikro-orm/core'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'
import { SysDeptEntityDto } from './sys-dept'
import { SysMenuEntityDto } from './sys-menu'
import { SysUserEntityDto } from './sys-user'

export class SysRoleEntityDto extends BaseEntityDto implements ISysRoleEntity {
  @ApiProperty({ description: '角色键值' })
  roleKey: string

  @ApiProperty({ description: '角色名称' })
  roleName: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark: IPropertyNullable<string>

  @ApiProperty({ description: '部门列表', type: () => [SysDeptEntityDto] })
  depts: Collection<ISysDeptEntity, ISysRoleEntity>

  @ApiProperty({ description: '菜单列表', type: () => [SysMenuEntityDto] })
  menus: Collection<ISysMenuEntity, ISysRoleEntity>

  @ApiProperty({ description: '用户列表', type: () => [SysUserEntityDto] })
  users: Collection<ISysUserEntity, ISysRoleEntity>
}

export class SysRoleEntityExcludeRelationDto extends OmitType(SysRoleEntityDto, ['depts', 'menus', 'users'] as const) {}
