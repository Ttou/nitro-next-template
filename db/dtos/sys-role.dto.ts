import type { Collection } from '@mikro-orm/core'
import type { IYesOrNoEnum } from '~shared/enums'
import type { SysDeptEntity, SysMenuEntity, SysRoleEntity, SysUserEntity } from '../entities'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base.dto'
import { SysDeptEntityDto } from './sys-dept.dto'
import { SysMenuEntityDto } from './sys-menu.dto'
import { SysUserEntityDto } from './sys-user.dto'

export class SysRoleEntityDto extends BaseEntityDto implements SysRoleEntity {
  @ApiProperty({ description: '角色键值' })
  roleKey: string

  @ApiProperty({ description: '角色名称' })
  roleName: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark?: INullable<string>

  @ApiProperty({
    description: '部门列表',
    type: () => [SysDeptEntityDto],
  })
  depts: Collection<SysDeptEntity, SysRoleEntity>

  @ApiProperty({
    description: '菜单列表',
    type: () => [SysMenuEntityDto],
  })
  menus: Collection<SysMenuEntity, SysRoleEntity>

  @ApiProperty({
    description: '用户列表',
    type: () => [SysUserEntityDto],
  })
  users: Collection<SysUserEntity, SysRoleEntity>
}

export class SysRoleEntityExcludeRelationDto extends OmitType(SysRoleEntityDto, ['depts', 'menus', 'users'] as const) {}
