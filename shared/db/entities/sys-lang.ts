import type { InferEntity } from '@mikro-orm/core'
import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../enums'
import { BaseEntity } from './base'

export const SysLangEntity = defineEntity({
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

export type ISysLangEntity = InferEntity<typeof SysLangEntity>
