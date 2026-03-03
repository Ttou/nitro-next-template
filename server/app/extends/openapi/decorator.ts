import type { ApiResponseNoStatusOptions } from '@nestjs/swagger'
import { RequestMethod } from '@nestjs/common'
import { METHOD_METADATA } from '@nestjs/common/constants'
import { ApiExtraModels, ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger'
import { merge } from 'es-toolkit'
import { camelCase } from 'scule'

type IAutoOperationOptions = Parameters<typeof ApiOperation>[0]

/**
 * 自动操作装饰器
 * @description 搭配 hey-api 使用，自动生成请求操作
 * @param options
 */
export function AutoOperation(options: IAutoOperationOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const controllerName = target.constructor.name.replace('Controller', '').toLowerCase()
    const methodName = propertyKey
    const httpMethod = RequestMethod[Reflect.getMetadata(METHOD_METADATA, target[propertyKey])]?.toLowerCase()

    const operationId = camelCase([controllerName, methodName, httpMethod])

    ApiOperation({ operationId, ...options })(target, propertyKey, descriptor)
  }
}

interface IAutoResponseOptions extends Omit<ApiResponseNoStatusOptions, 'type'> {
  type: Function | Function[]
}

/**
 * 自动响应装饰器
 * @description 搭配 hey-api 使用，自动生成请求响应
 * @param options
 */
export function AutoResponse(options: IAutoResponseOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const { type, ...restOptions } = options
    const isArray = Array.isArray(type)
    const model = isArray ? type[0]! : type
    const isNormalType = [Number, String, Boolean, Date].includes(model)

    if (isNormalType) {
      const schemaOptions = {
        schema: isArray ? { type: 'array', items: { type: model?.name.toLowerCase() } } : { type: model?.name.toLowerCase() },
      }

      ApiOkResponse(merge(schemaOptions, restOptions))(target, propertyKey, descriptor)
    }
    else {
      const schemaOptions = {
        schema: isArray ? { type: 'array', items: { $ref: getSchemaPath(model) } } : { type: 'object', $ref: getSchemaPath(model) },
      }

      ApiExtraModels(model)(target, propertyKey, descriptor)
      ApiOkResponse(merge(schemaOptions, restOptions))(target, propertyKey, descriptor)
    }
  }
}
