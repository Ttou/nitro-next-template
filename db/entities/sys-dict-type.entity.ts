import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'

const SysDictTypeEntitySchema = defineEntity({
  name: 'SysDictTypeEntity',
  tableName: 'sys_dict_type',
  extends: BaseEntity,
  properties: {
    dictName: p.string(),
    dictType: p.string(),
    isAvailable: p.enum(YesOrNoEnumValues),
    remark: p.string().nullable(),
  },
})

export class SysDictTypeEntity extends SysDictTypeEntitySchema.class {}

SysDictTypeEntitySchema.setClass(SysDictTypeEntity)
