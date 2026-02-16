import { ApiProperty } from '@nestjs/swagger'

import { ResultResDto } from './result'

/**
 * 导出数据
 */
class ExportData {
  @ApiProperty({ description: '响应头' })
  headers: Record<string, any>

  @ApiProperty({ description: '响应体' })
  body: Buffer
}

/**
 * 导出结果响应传输对象
 */
export class ExportResDto extends ResultResDto(ExportData) {}
