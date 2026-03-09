import { ApiOkResponse } from '@nestjs/swagger'

/**
 * 导出Excel响应装饰器
 */
export function ApiExcelResponse() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value = async function (req: Request, res: Response) {
      ApiOkResponse({
        content: {
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
            schema: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })(target, propertyKey, descriptor)
    }
  }
}
