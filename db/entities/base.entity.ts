import { defineEntity, p } from '@mikro-orm/core'
import { generateId } from '../../shared/utils/index.ts'

const BaseEntitySchema = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  properties: {
    // 与原来 `type: 'uuid'` 一致：MySQL 里是 varchar(36)
    id: p.string().primary().length(36).onCreate(() => generateId()),
    createBy: p.string().nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updateBy: p.string().nullable(),
    updatedAt: p.datetime().onCreate(() => new Date()).onUpdate(() => new Date()),
  },
})

export class BaseEntity extends BaseEntitySchema.class {}

BaseEntitySchema.setClass(BaseEntity)
