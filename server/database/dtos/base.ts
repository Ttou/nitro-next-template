import type { IPropertyNullable } from '~server/interfaces'
import type { BaseEntity } from '../entities'
import { ApiProperty } from '@nestjs/swagger'

export class BaseEntityDto implements BaseEntity {
  @ApiProperty({ description: '主键', type: String })
  id: string

  @ApiProperty({ description: '创建人' })
  createBy: IPropertyNullable<string>

  @ApiProperty({ description: '创建时间', type: Date })
  createdAt: Date

  @ApiProperty({ description: '更新人' })
  updateBy: IPropertyNullable<string>

  @ApiProperty({ description: '更新时间', type: Date })
  updatedAt: Date
}
