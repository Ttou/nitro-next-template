import type { InferEntity } from '@mikro-orm/core'
import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../enums'
import { BaseEntity } from './base'

export const SysDictTypeEntity = defineEntity({
  name: 'SysDictTypeEntity',
  tableName: 'sys_dict_type',
  extends: BaseEntity,
  properties: {
    dictName: p.string(),
    dictType: p.string(),
    isAvailable: p.enum(() => YesOrNoEnumValues),
    remark: p.string().nullable(),
  },
})

export type ISysDictTypeEntity = InferEntity<typeof SysDictTypeEntity>
