import { defineEntity, p } from '@mikro-orm/core'
import { generateId } from '~shared/utils'

const BaseSchema = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  properties: {
    id: p.uuid().primary().onCreate(() => generateId()),
    createBy: p.string().nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updateBy: p.string().nullable(),
    updatedAt: p.datetime().onUpdate(() => new Date()),
  },
})

export class BaseEntity extends BaseSchema.class {}

BaseSchema.setClass(BaseEntity)
