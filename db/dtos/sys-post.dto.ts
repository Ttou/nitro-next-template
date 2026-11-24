import { z } from 'zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { enumField } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统岗位（不含关联）
 */
export const sysPostEntityExcludeRelationSchema = baseEntitySchema.extend({
  postKey: z.string().describe('岗位键值'),
  postName: z.string().describe('岗位名称'),
  isAvailable: enumField(YesOrNoEnumValues).describe('是否可用'),
  remark: z.string().nullish().describe('备注'),
}).meta({ id: 'SysPostEntityExcludeRelationDto' })

export type SysPostEntityExcludeRelationDto = z.infer<typeof sysPostEntityExcludeRelationSchema>
