import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ abstract: true })
export class BaseEntity {
  @PrimaryKey({ type: 'bigint', autoincrement: true })
  id!: bigint

  @Property({ nullable: true })
  createBy?: string

  @Property()
  createdAt? = new Date()

  @Property({ nullable: true })
  updateBy?: string

  @Property({ onUpdate: () => new Date() })
  updatedAt? = new Date()
}
