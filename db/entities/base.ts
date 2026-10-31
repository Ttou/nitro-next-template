import { OptionalProps } from '@mikro-orm/core'
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy'
import { generateId } from '../../shared/utils/index.ts'

@Entity({ abstract: true })
export abstract class BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt'

  @PrimaryKey({
    type: 'uuid',
    onCreate: () => generateId(),
  })
  id: string

  @Property({ type: 'string', nullable: true })
  createBy?: INullable<string>

  @Property({
    type: 'datetime',
    onCreate: () => new Date(),
  })
  createdAt: Date

  @Property({ type: 'string', nullable: true })
  updateBy?: INullable<string>

  @Property({
    type: 'datetime',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt: Date
}
