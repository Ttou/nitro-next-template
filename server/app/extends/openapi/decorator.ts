import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

/**
 * 导出Excel响应装饰器
 */
export function ApiExcelResponse() {
  return applyDecorators(
    ApiOkResponse({
      content: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  )
}
