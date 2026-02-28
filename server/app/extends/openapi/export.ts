import { ApiProperty } from '@nestjs/swagger'

/**
 * 导出结果响应传输对象
 */
export class ExportResDto {
  @ApiProperty({ description: '响应头' })
  headers: Record<string, any>

  @ApiProperty({ description: '响应体' })
  body: Buffer
}
