import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from '~db/entities'

export class BaseEntityDto implements BaseEntity {
  @ApiProperty({ description: '主键', type: String })
  id: string

  @ApiProperty({ description: '创建人' })
  createBy?: INullable<string>

  @ApiProperty({ description: '创建时间', type: Date })
  createdAt: Date

  @ApiProperty({ description: '更新人' })
  updateBy?: INullable<string>

  @ApiProperty({ description: '更新时间', type: Date })
  updatedAt: Date
}
