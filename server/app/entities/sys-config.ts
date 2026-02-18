import type { IYesOrNoEnum } from '~shared/enums'
import { Entity, Enum, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

@Entity({ tableName: 'sys_config' })
export class SysConfigEntity extends BaseEntity {
  @ApiProperty({ description: '配置名称' })
  @Property()
  configName: string

  @ApiProperty({ description: '配置键值' })
  @Property({ unique: true })
  configKey: string

  @ApiProperty({ description: '配置值' })
  @Property()
  configValue: string

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
