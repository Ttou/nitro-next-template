import type { ExecutionContext } from '@nestjs/common'
import type { StringValue } from 'ms'
import { Reflector } from '@nestjs/core'

export const CacheKey = Reflector.createDecorator<string | ((context: ExecutionContext) => string)>({
  key: 'cache:key',
})

export const CacheTTL = Reflector.createDecorator<StringValue>({
  key: 'cache:ttl',
})
