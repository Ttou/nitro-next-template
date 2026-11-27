import type { BaseEntity } from '~db/entities/base.entity'
import type { EntityDtoSchema } from './entity-constraint'
import { z } from 'zod'
import { dateTimeField } from '~shared/utils'

/**
 * 实体公共字段
 */
export const baseEntitySchema = z.object({
  id: z.string().describe('主键'),
  createBy: z.string().nullish().describe('创建人'),
  createdAt: dateTimeField('创建时间'),
  updateBy: z.string().nullish().describe('更新人'),
  updatedAt: dateTimeField('更新时间'),
}) satisfies EntityDtoSchema<BaseEntity>

export type BaseEntityDto = z.infer<typeof baseEntitySchema>
