import type { SysDeptEntity } from '../entities/sys-dept.entity'
import type { EntityDtoSchema } from './entity-constraint'
import { z } from 'zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { enumField } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统部门（不含关联）
 */
export const sysDeptEntityExcludeRelationSchema = baseEntitySchema.extend({
  parentId: z.string().nullish().describe('父部门ID'),
  deptKey: z.string().describe('部门键值'),
  deptName: z.string().describe('部门名称'),
  isAvailable: enumField(YesOrNoEnumValues).describe('是否可用'),
  remark: z.string().nullish().describe('备注'),
}).meta({ id: 'SysDeptEntityExcludeRelationDto' }) satisfies EntityDtoSchema<SysDeptEntity>

export type SysDeptEntityExcludeRelationDto = z.infer<typeof sysDeptEntityExcludeRelationSchema>
