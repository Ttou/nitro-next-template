import type { Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 结果响应传输对象
 * @param {T} classRef 响应数据类
 */
export function ResultResDto<T extends Type>(classRef: T) {
  class Result {
    @ApiProperty({ description: '时间戳', example: 1606827398000 })
    timestamp: number

    @ApiProperty({ description: '状态码', example: 200 })
    status: number

    @ApiProperty({ description: '响应数据', type: classRef })
    data: T
  }
  return Result
}
