import type { SysDictTypeEntity } from '../entities/sys-dict-type.entity'
import type { EntityDtoSchema } from './entity-constraint'
import { z } from 'zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { enumField } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统字典类型
 */
export const sysDictTypeEntitySchema = baseEntitySchema.extend({
  dictName: z.string().describe('字典名称'),
  dictType: z.string().describe('字典类型'),
  isAvailable: enumField(YesOrNoEnumValues).describe('是否可用'),
  remark: z.string().nullish().describe('备注'),
}).meta({ id: 'SysDictTypeEntityDto' }) satisfies EntityDtoSchema<SysDictTypeEntity>

export type SysDictTypeEntityDto = z.infer<typeof sysDictTypeEntitySchema>
