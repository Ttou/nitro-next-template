import type { StringValue } from 'ms'
import type { IRequest } from '~server/interfaces'
import { Reflector } from '@nestjs/core'

export const CacheKey = Reflector.createDecorator<(req: IRequest) => string>({
  key: 'cache:key',
})

export const CacheTTL = Reflector.createDecorator<StringValue>({
  key: 'cache:ttl',
})
