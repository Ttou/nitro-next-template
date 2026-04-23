import type { IPropertyNullable } from '~server/interfaces'
import type { IYesOrNoEnum } from '~shared/enums'
import type { SysLangEntity } from '../entities'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'

export class SysLangEntityDto extends BaseEntityDto implements SysLangEntity {
  @ApiProperty({ description: '语言键值' })
  langKey: string

  @ApiProperty({ description: '语言值' })
  langValue: IPropertyNullable<string>

  @ApiProperty({ description: '是否内置', enum: YesOrNoEnumMap })
  isBuiltin: IYesOrNoEnum

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark: IPropertyNullable<string>
}
