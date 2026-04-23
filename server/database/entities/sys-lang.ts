import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

const SysLangSchema = defineEntity({
  name: 'SysLangEntity',
  tableName: 'sys_lang',
  extends: BaseEntity,
  properties: {
    langKey: p.string().unique(),
    langValue: p.string().nullable(),
    isBuiltin: p.enum(() => YesOrNoEnumValues),
    isAvailable: p.enum(() => YesOrNoEnumValues),
    remark: p.string().nullable(),
  },
})
export class SysLangEntity extends SysLangSchema.class {}

SysLangSchema.setClass(SysLangEntity)
