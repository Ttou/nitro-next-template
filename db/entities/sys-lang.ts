import type { ILangEnum, IYesOrNoEnum } from '../../shared/enums/index.ts'
import { Entity, Enum, Property } from '@mikro-orm/decorators/legacy'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.ts'

@Entity({ tableName: 'sys_lang' })
export class SysLangEntity extends BaseEntity {
  @Property({ type: 'string', unique: true })
  langKey: string

  @Property({ type: 'json', nullable: true })
  langValue?: INullable<Record<ILangEnum, string>>

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
