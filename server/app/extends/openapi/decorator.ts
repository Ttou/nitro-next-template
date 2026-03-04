import { RequestMethod } from '@nestjs/common'
import { METHOD_METADATA } from '@nestjs/common/constants'
import { ApiOperation } from '@nestjs/swagger'
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
