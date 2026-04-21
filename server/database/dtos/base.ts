import type { BaseEntity } from '../entities'
import { ApiProperty } from '@nestjs/swagger'

export class BaseEntityDto implements BaseEntity {
  @ApiProperty({ description: '主键', type: String })
  id: string

  @ApiProperty({ description: '创建人' })
  createBy?: string

  @ApiProperty({ description: '创建时间', type: Date })
  createdAt?: Date

  @ApiProperty({ description: '更新人' })
  updateBy?: string

  @ApiProperty({ description: '更新时间', type: Date })
  updatedAt?: Date
}
