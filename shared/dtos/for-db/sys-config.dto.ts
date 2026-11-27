import type { SysConfigEntity } from '~db/entities/sys-config.entity'
import type { EntityDtoSchema } from './entity-constraint'
import { z } from 'zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, enumField, lazySchema } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统配置
 */
export const sysConfigEntitySchema = lazySchema(() => ((defineSchema(baseEntitySchema().extend({
  configKey: z.string().describe('配置键值'),
  configName: z.string().describe('配置名称'),
  configValue: z.string().describe('配置值'),
  isBuiltin: enumField(YesOrNoEnumValues).describe('是否内置'),
  isAvailable: enumField(YesOrNoEnumValues).describe('是否可用'),
  remark: z.string().nullish().describe('备注'),
}), { id: 'SysConfigEntityDto' })) satisfies EntityDtoSchema<SysConfigEntity>))

export type SysConfigEntityDto = z.infer<ReturnType<typeof sysConfigEntitySchema>>
