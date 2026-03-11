import { applyDecorators } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger'

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

/**
 * 文件上传装饰器
 */
export function ApiFile() {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  )
}
