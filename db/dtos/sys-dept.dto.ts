import type { Collection } from '@mikro-orm/core'
import type { IYesOrNoEnum } from '~shared/enums'
import type { SysDeptEntity, SysRoleEntity, SysUserEntity } from '../entities'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base.dto'
import { SysRoleEntityDto } from './sys-role.dto'
import { SysUserEntityDto } from './sys-user.dto'

export class SysDeptEntityDto extends BaseEntityDto implements SysDeptEntity {
  @ApiProperty({ description: '父部门ID' })
  parentId?: INullable<string>

  @ApiProperty({ description: '部门键值' })
  deptKey: string

  @ApiProperty({ description: '部门名称' })
  deptName: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark?: INullable<string>

  @ApiProperty({
    description: '角色',
    type: () => [SysRoleEntityDto],
  })
  roles: Collection<SysRoleEntity, SysDeptEntity>

  @ApiProperty({
    description: '用户',
    type: () => [SysUserEntityDto],
  })
  users: Collection<SysUserEntity, SysDeptEntity>
}

export class SysDeptEntityExcludeRelationDto extends OmitType(SysDeptEntityDto, ['roles', 'users'] as const) {}
