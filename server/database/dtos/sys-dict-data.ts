import type { IPropertyNullable } from '~server/interfaces'
import type { IYesOrNoEnum } from '~shared/enums'
import type { SysDictDataEntity } from '../entities'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'

export class SysDictDataEntityDto extends BaseEntityDto implements SysDictDataEntity {
  @ApiProperty({ description: '字典标签' })
  dictLabel: string

  @ApiProperty({ description: '字典值' })
  dictValue: string

  @ApiProperty({ description: '字典类型' })
  dictType: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  remark: IPropertyNullable<string>
}
