import type { Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsPositive, Min } from 'class-validator'

/**
 * 分页请求传输对象
 */
export class PageReqDto {
  @ApiProperty({ description: '页码', default: 1 })
  @IsPositive({ message: '页码必须是正整数' })
  @Min(1, { message: '页码最小值为 1' })
  page: number

  @ApiProperty({ description: '页长', default: 15 })
  @IsPositive({ message: '页长必须是正整数' })
  @Min(1, { message: '页长最小值为 1' })
  pageSize: number
}

/**
 * 分页响应传输对象
 * @param {T} classRef 列表类
 */
export function PageResDto<T extends Type>(classRef: T) {
  class Page {
    @ApiProperty({ description: '页码' })
    page: number

    @ApiProperty({ description: '页长' })
    pageSize: number

    @ApiProperty({ description: '总数' })
    total: number

    @ApiProperty({ description: '列表', type: [classRef] })
    data: T[]
  }
  return Page
}
