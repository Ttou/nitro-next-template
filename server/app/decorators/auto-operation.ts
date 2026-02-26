import { RequestMethod } from '@nestjs/common'
import { METHOD_METADATA } from '@nestjs/common/constants'
import { ApiOperation } from '@nestjs/swagger'
import { camelCase } from 'scule'

export function AutoOperation(options: Parameters<typeof ApiOperation>[0] = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const controllerName = target.constructor.name.replace('Controller', '').toLowerCase()
    const methodName = propertyKey
    const httpMethod = RequestMethod[Reflect.getMetadata(METHOD_METADATA, target[propertyKey])]?.toLowerCase()

    const operationId = camelCase([controllerName, methodName, httpMethod])

    ApiOperation({ operationId, ...options })(target, propertyKey, descriptor)
  }
}
