import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '~shared/enums'
import { BaseEntity } from './base'

const SysConfigSchema = defineEntity({
  name: 'SysConfigEntity',
  tableName: 'sys_config',
  extends: BaseEntity,
  properties: {
    configKey: p.string().unique(),
    configName: p.string(),
    configValue: p.string(),
    isBuiltin: p.enum(() => YesOrNoEnumValues),
    isAvailable: p.enum(() => YesOrNoEnumValues),
    remark: p.string().nullable(),
  },
})

export class SysConfigEntity extends SysConfigSchema.class {}

SysConfigSchema.setClass(SysConfigEntity)
