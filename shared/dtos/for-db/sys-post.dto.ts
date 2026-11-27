import type { SysPostEntity } from '~db/entities/sys-post.entity'
import type { EntityDtoSchema } from './entity-constraint'
import { z } from 'zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, enumField, lazySchema } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统岗位（不含关联）
 */
export const sysPostEntityExcludeRelationSchema = lazySchema(() => ((defineSchema(baseEntitySchema().extend({
  postKey: z.string().describe('岗位键值'),
  postName: z.string().describe('岗位名称'),
  isAvailable: enumField(YesOrNoEnumValues).describe('是否可用'),
  remark: z.string().nullish().describe('备注'),
}), { id: 'SysPostEntityExcludeRelationDto' })) satisfies EntityDtoSchema<SysPostEntity>))

export type SysPostEntityExcludeRelationDto = z.infer<ReturnType<typeof sysPostEntityExcludeRelationSchema>>
