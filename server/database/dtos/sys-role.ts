import type { IYesOrNoEnum } from '~shared/enums'
import type { SysRoleEntity } from '../entities'
import { Collection } from '@mikro-orm/core'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'
import { SysDeptEntityDto } from './sys-dept'
import { SysMenuEntityDto } from './sys-menu'
import { SysUserEntityDto } from './sys-user'

export class SysRoleEntityDto extends BaseEntityDto implements SysRoleEntity {
  @ApiProperty({ description: '角色键值' })
  roleKey: string

  @ApiProperty({ description: '角色名称' })
  roleName: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark?: string

  @ApiProperty({ description: '部门列表', type: () => [SysDeptEntityDto] })
  depts: Collection<SysDeptEntityDto, SysRoleEntityDto>

  @ApiProperty({ description: '菜单列表', type: () => [SysMenuEntityDto] })
  menus: Collection<SysMenuEntityDto, SysRoleEntityDto>

  @ApiProperty({ description: '用户列表', type: () => [SysUserEntityDto] })
  users: Collection<SysUserEntityDto, SysRoleEntityDto>
}

export class SysRoleEntityNoRelations extends OmitType(SysRoleEntityDto, ['depts', 'menus', 'users'] as const) {}
