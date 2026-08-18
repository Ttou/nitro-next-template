import type { InferEntity } from '@mikro-orm/core'
import { defineEntity, p } from '@mikro-orm/core'
import { YesOrNoEnumValues } from '../../shared/enums'
import { BaseEntity } from './base'

export const SysConfigEntity = defineEntity({
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

export type ISysConfigEntity = InferEntity<typeof SysConfigEntity>
