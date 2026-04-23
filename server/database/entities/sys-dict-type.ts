import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

const SysDictTypeSchema = defineEntity({
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

export class SysDictTypeEntity extends SysDictTypeSchema.class {}

SysDictTypeSchema.setClass(SysDictTypeEntity)
