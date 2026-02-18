import type { IYesOrNoEnum } from '~shared/enums'
import { Entity, Enum, Index, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

@Entity({ tableName: 'sys_dict_data' })
@Index({ properties: ['dictType', 'dictValue'] })
export class SysDictDataEntity extends BaseEntity {
  @ApiProperty({ description: '字典标签' })
  @Property()
  dictLabel: string

  @ApiProperty({ description: '字典值' })
  @Property()
  dictValue: string

  @ApiProperty({ description: '字典类型' })
  @Property()
  dictType: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  @Property({ nullable: true })
  remark?: string
}
