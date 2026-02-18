import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty } from 'class-validator'

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
  ids: any[]
}
