import type { Request } from 'express'
import type { StringValue } from 'ms'
import { Reflector } from '@nestjs/core'

type CacheFunc = (req: Request) => string

export const CacheKey = Reflector.createDecorator<CacheFunc>()

export const CacheTTL = Reflector.createDecorator<StringValue>()
