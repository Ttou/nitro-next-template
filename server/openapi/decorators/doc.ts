import { applyDecorators } from '@nestjs/common'
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger'
import { PageResDto } from '../dtos'

interface ApiDocOptions {
  endpointSummary: string
  endpointDescription?: string
  responseDto?: any
  isArray?: boolean
  isPage?: boolean
  isExcel?: boolean
  isUpload?: boolean
  deprecated?: boolean
  responseDescription?: string
}

function isPrimitiveConstructor(type: StringConstructor | NumberConstructor | BooleanConstructor) {
  return [String, Number, Boolean].includes(type)
}

export function ApiDoc(options: ApiDocOptions) {
  const responseDescription = options.responseDescription || '请求成功'

  const decorators = [
    ApiOperation({
      description: options.endpointDescription,
      summary: options.endpointSummary,
      deprecated: options.deprecated,
    }),
  ]

  if (options.isUpload) {
    decorators.push(
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

  if (options.isExcel) {
    decorators.push(
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
  else if (options.isPage && options.responseDto) {
    decorators.push(
      ApiOkResponse({
        schema: {
          description: responseDescription,
          allOf: [
            { $ref: getSchemaPath(PageResDto) },
            {
              properties: {
                data: {
                  type: 'array',
                  items: {
                    $ref: getSchemaPath(options.responseDto),
                  },
                },
              },
            },
          ],
        },
      }),
      ApiExtraModels(options.responseDto, PageResDto),
    )
  }
  else if (options.responseDto) {
    const isPrimitive = isPrimitiveConstructor(options.responseDto)
    const refsOrType = isPrimitive ? { type: options.responseDto.name.toLowerCase() } : { $ref: getSchemaPath(options.responseDto) }
    const models = isPrimitive ? [] : [options.responseDto]

    decorators.push(
      ApiOkResponse({
        description: responseDescription,
        schema: options.isArray
          ? {
              type: 'array',
              items: refsOrType,
            }
          : refsOrType,
      }),
      ApiExtraModels(...models),
    )
  }
  else {
    decorators.push(
      ApiOkResponse({
        description: responseDescription,
      }),
    )
  }

  return applyDecorators(...decorators)
}
