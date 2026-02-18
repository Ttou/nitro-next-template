import type { IYesOrNoEnum } from '~shared/enums'
import { Entity, Enum, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

@Entity({ tableName: 'sys_dict_type' })
export class SysDictTypeEntity extends BaseEntity {
  @ApiProperty({ description: '字典名称' })
  @Property()
  dictName: string

  @ApiProperty({ description: '字典类型' })
  @Property({ unique: true })
  dictType: string

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  @Property({ nullable: true })
  remark?: string
}
