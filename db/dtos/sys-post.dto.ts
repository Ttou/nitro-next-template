import type { Collection } from '@mikro-orm/core'
import type { IYesOrNoEnum } from '~shared/enums'
import type { SysPostEntity, SysUserEntity } from '../entities'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base.dto'
import { SysUserEntityDto } from './sys-user.dto'

export class SysPostEntityDto extends BaseEntityDto implements SysPostEntity {
  @ApiProperty({ description: '岗位键值' })
  postKey: string

  @ApiProperty({ description: '岗位名称' })
  postName: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark?: INullable<string>

  @ApiProperty({
    description: '用户列表',
    type: () => [SysUserEntityDto],
  })
  users: Collection<SysUserEntity, SysPostEntity>
}

export class SysPostEntityExcludeRelationDto extends OmitType(SysPostEntityDto, ['users'] as const) {}
