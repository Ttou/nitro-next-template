import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

const SysDictDataSchema = defineEntity({
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
export class SysDictDataEntity extends SysDictDataSchema.class {}

SysDictDataSchema.setClass(SysDictDataEntity)
