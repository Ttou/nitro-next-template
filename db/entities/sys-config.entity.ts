import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'

const SysConfigEntitySchema = defineEntity({
  name: 'SysConfigEntity',
  tableName: 'sys_config',
  extends: BaseEntity,
  properties: {
    configKey: p.string().unique(),
    configName: p.string(),
    configValue: p.string(),
    isBuiltin: p.enum(YesOrNoEnumValues),
    isAvailable: p.enum(YesOrNoEnumValues),
    remark: p.string().nullable(),
  },
})

export class SysConfigEntity extends SysConfigEntitySchema.class {}

SysConfigEntitySchema.setClass(SysConfigEntity)
