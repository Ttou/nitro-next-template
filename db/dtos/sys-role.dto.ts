import { z } from 'zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { enumField } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统角色（不含关联）
 */
export const sysRoleEntityExcludeRelationSchema = baseEntitySchema.extend({
  roleKey: z.string().describe('角色键值'),
  roleName: z.string().describe('角色名称'),
  isAvailable: enumField(YesOrNoEnumValues).describe('是否可用'),
  remark: z.string().nullish().describe('备注'),
}).meta({ id: 'SysRoleEntityExcludeRelationDto' })

export type SysRoleEntityExcludeRelationDto = z.infer<typeof sysRoleEntityExcludeRelationSchema>
