import type { IYesOrNoEnum } from '~shared/enums'
import type { SysPostEntity } from '../entities'
import { Collection } from '@mikro-orm/core'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'
import { SysUserEntityDto } from './sys-user'

export class SysPostEntityDto extends BaseEntityDto implements SysPostEntity {
  @ApiProperty({ description: '岗位键值' })
  postKey: string

  @ApiProperty({ description: '岗位名称' })
  postName: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark?: string

  @ApiProperty({ description: '用户列表', type: () => [SysUserEntityDto] })
  users: Collection<SysUserEntityDto, SysPostEntityDto>
}

export class SysPostEntityExcludeRelationDto extends OmitType(SysPostEntityDto, ['users'] as const) {}
