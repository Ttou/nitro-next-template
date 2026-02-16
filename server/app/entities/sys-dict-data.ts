import type { IYesOrNoEnum } from '~shared/enums'
import { Entity, Enum, Index, Property } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

@Entity({ tableName: 'sys_dict_data' })
@Index({ properties: ['dictType', 'dictValue'] })
export class SysDictDataEntity extends BaseEntity {
  @Property()
  dictLabel: string

  @Property()
  dictValue: string

  @Property()
  dictType: string

  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @Property({ nullable: true })
  remark?: string
}
