import type { IYesOrNoEnum } from '~shared/enums'
import type { SysDeptEntity } from '../entities'
import { Collection } from '@mikro-orm/core'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'
import { SysRoleEntityDto } from './sys-role'
import { SysUserEntityDto } from './sys-user'

export class SysDeptEntityDto extends BaseEntityDto implements SysDeptEntity {
  @ApiProperty({ description: '父部门ID' })
  parentId?: string

  @ApiProperty({ description: '部门键值' })
  deptKey: string

  @ApiProperty({ description: '部门名称' })
  deptName: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark?: string

  @ApiProperty({ description: '角色', type: () => [SysRoleEntityDto] })
  roles: Collection<SysRoleEntityDto, SysDeptEntityDto>

  @ApiProperty({ description: '用户', type: () => [SysUserEntityDto] })
  users: Collection<SysUserEntityDto, SysDeptEntityDto>
}

export class SysDeptEntityExcludeRelationDto extends OmitType(SysDeptEntityDto, ['roles', 'users'] as const) {}
