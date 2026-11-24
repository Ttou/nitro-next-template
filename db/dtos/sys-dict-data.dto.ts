import { z } from 'zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { enumField } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统字典数据
 */
export const sysDictDataEntitySchema = baseEntitySchema.extend({
  dictLabel: z.string().describe('字典标签'),
  dictValue: z.string().describe('字典值'),
  dictType: z.string().describe('字典类型'),
  isAvailable: enumField(YesOrNoEnumValues).describe('是否可用'),
  remark: z.string().nullish().describe('备注'),
}).meta({ id: 'SysDictDataEntityDto' })

export type SysDictDataEntityDto = z.infer<typeof sysDictDataEntitySchema>
