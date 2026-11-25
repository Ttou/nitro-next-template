import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'

const SysDictDataEntitySchema = defineEntity({
  name: 'SysDictDataEntity',
  tableName: 'sys_dict_data',
  extends: BaseEntity,
  indexes: [
    {
      properties: ['dictType', 'dictValue'],
    },
  ],
  properties: {
    dictLabel: p.string(),
    dictValue: p.string(),
    dictType: p.string(),
    isAvailable: p.enum(YesOrNoEnumValues),
    remark: p.string().nullable(),
  },
})

export class SysDictDataEntity extends SysDictDataEntitySchema.class {}

SysDictDataEntitySchema.setClass(SysDictDataEntity)
