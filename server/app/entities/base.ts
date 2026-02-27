import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { generateId } from '~shared/utils'

@Entity({ abstract: true })
export class BaseEntity {
  @ApiProperty({ description: '主键' })
  @PrimaryKey()
  id = generateId()

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
