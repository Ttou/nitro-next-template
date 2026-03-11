import type { StringValue } from 'ms'
import type { IRequest } from '../interfaces'
import { Reflector } from '@nestjs/core'

type CacheFunc = (req: IRequest) => string

export const CacheKey = Reflector.createDecorator<CacheFunc>()

export const CacheTTL = Reflector.createDecorator<StringValue>()
