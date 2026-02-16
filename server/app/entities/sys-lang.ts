import type { IYesOrNoEnum } from '~shared/enums'
import { Entity, Enum, Property } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

@Entity({ tableName: 'sys_lang' })
export class SysLangEntity extends BaseEntity {
  @Property({ unique: true })
  langKey: string

  @Property({ nullable: true })
  langValue?: string

  @Enum({ items: () => YesOrNoEnumValues })
  isBuiltin: IYesOrNoEnum

  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @Property({ nullable: true })
  remark?: string
}
