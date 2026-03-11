import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsPositive, IsUUID, Min } from 'class-validator'

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
export function PageResDto<T>(classRef: T) {
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

/**
 * 删除请求传输对象
 */
export class RemoveReqDto {
  @ApiProperty({
    description: '主键数组',
    type: 'array',
    items: { type: 'string' },
  })
  @ArrayNotEmpty({ message: '主键数组不能为空' })
  @IsUUID('7', { each: true, message: '主键格式不正确' })
  ids: string[]
}

/**
 * 导出结果响应传输对象
 */
export class ExportResDto {
  @ApiProperty({ description: '响应头' })
  headers: Record<string, any>

  @ApiProperty({ description: '响应体' })
  body: Buffer
}
