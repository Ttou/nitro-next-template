import type { InferEntity } from '@mikro-orm/core'
import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../shared/enums'
import { BaseEntity } from './base'

export const SysDictDataEntity = defineEntity({
  name: 'SysDictDataEntity',
  tableName: 'sys_dict_data',
  indexes: [{ properties: ['dictType', 'dictValue'] }],
  extends: BaseEntity,
  properties: {
    dictLabel: p.string(),
    dictValue: p.string(),
    dictType: p.string(),
    isAvailable: p.enum(() => YesOrNoEnumValues),
    remark: p.string().nullable(),
  },
})

export type ISysDictDataEntity = InferEntity<typeof SysDictDataEntity>
