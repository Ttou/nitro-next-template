import type { IYesOrNoEnum } from '~shared/enums'
import { Entity, Enum, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

@Entity({ tableName: 'sys_lang' })
export class SysLangEntity extends BaseEntity {
  @ApiProperty({ description: '语言键值' })
  @Property({ unique: true })
  langKey: string

  @ApiProperty({ description: '语言值' })
  @Property({ nullable: true })
  langValue?: string

  @ApiProperty({ description: '是否内置', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues })
  isBuiltin: IYesOrNoEnum

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  @Property({ nullable: true })
  remark?: string
}
