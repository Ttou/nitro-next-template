import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'

@Entity({ abstract: true })
export class BaseEntity {
  @ApiProperty({ description: '主键' })
  @PrimaryKey({ type: 'bigint', autoincrement: true })
  id!: bigint

  @ApiProperty({ description: '创建人' })
  @Property({ nullable: true })
  createBy?: string

  @ApiProperty({ description: '创建时间' })
  @Property()
  createdAt? = new Date()

  @ApiProperty({ description: '更新人' })
  @Property({ nullable: true })
  updateBy?: string

  @ApiProperty({ description: '更新时间' })
  @Property({ onUpdate: () => new Date() })
  updatedAt? = new Date()
}
