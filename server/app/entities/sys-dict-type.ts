import type { IYesOrNoEnum } from '~shared/enums'
import { Entity, Enum, Property } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

@Entity({ tableName: 'sys_dict_type' })
export class SysDictTypeEntity extends BaseEntity {
  @Property()
  dictName: string

  @Property({ unique: true })
  dictType: string

  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @Property({ nullable: true })
  remark?: string
}
