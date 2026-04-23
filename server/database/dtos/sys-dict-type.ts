import type { IPropertyNullable } from '~server/interfaces'
import type { IYesOrNoEnum } from '~shared/enums'
import type { SysDictTypeEntity } from '../entities'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'

export class SysDictTypeEntityDto extends BaseEntityDto implements SysDictTypeEntity {
  @ApiProperty({ description: '字典名称' })
  dictName: string

  @ApiProperty({ description: '字典类型' })
  dictType: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark: IPropertyNullable<string>
}
