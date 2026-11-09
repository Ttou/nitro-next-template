import type { IYesOrNoEnum } from '../../shared/enums/index.ts'
import { Entity, Enum, Property } from '@mikro-orm/decorators/legacy'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'

@Entity({ tableName: 'sys_config' })
export class SysConfigEntity extends BaseEntity {
  @Property({ type: 'string', unique: true })
  configKey: string

  @Property({ type: 'string' })
  configName: string

  @Property({ type: 'string' })
  configValue: string

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
  })
  isBuiltin: IYesOrNoEnum

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
  })
  isAvailable: IYesOrNoEnum

  @Property({ type: 'string', nullable: true })
  remark?: INullable<string>
}
