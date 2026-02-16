import type { IYesOrNoEnum } from '~shared/enums'
import { Entity, Enum, Property } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

@Entity({ tableName: 'sys_config' })
export class SysConfigEntity extends BaseEntity {
  @Property()
  configName: string

  @Property({ unique: true })
  configKey: string

  @Property()
  configValue: string

  @Enum({ items: () => YesOrNoEnumValues })
  isBuiltin: IYesOrNoEnum

  @Enum({ items: () => YesOrNoEnumValues })
  isAvailable: IYesOrNoEnum

  @Property({ nullable: true })
  remark?: string
}
