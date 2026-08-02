import type { InferEntity } from '@mikro-orm/core'
import { defineEntity, p } from '@mikro-orm/core'
import { generateId } from '../../utils'

export const BaseEntity = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  properties: {
    id: p.uuid().primary().onCreate(() => generateId()),
    createBy: p.string().nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updateBy: p.string().nullable(),
    updatedAt: p.datetime().onCreate(() => new Date()).onUpdate(() => new Date()),
  },
})

export type IBaseEntity = InferEntity<typeof BaseEntity>
