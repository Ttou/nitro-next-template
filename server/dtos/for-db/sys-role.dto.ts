import type { SysRoleEntity } from '~db/entities/sys-role.entity'
import type { EntityDtoSchema } from './entity-constraint'
import { z } from 'zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, enumField } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统角色（不含关联）
 */
export const sysRoleEntityExcludeRelationSchema = defineSchema(baseEntitySchema.extend({
  roleKey: z.string().describe('角色键值'),
  roleName: z.string().describe('角色名称'),
  isAvailable: enumField(YesOrNoEnumValues).describe('是否可用'),
  remark: z.string().nullish().describe('备注'),
}), { id: 'SysRoleEntityExcludeRelationDto' }) satisfies EntityDtoSchema<SysRoleEntity>

export type SysRoleEntityExcludeRelationDto = z.infer<typeof sysRoleEntityExcludeRelationSchema>
