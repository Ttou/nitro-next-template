import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IRequest } from '../interfaces'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { of, tap } from 'rxjs'
import { CacheKey, CacheTTL } from '../decorators'
import { logger } from '../loggers'
import { CacheService } from '../services'

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: CacheService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const cacheKeyFunc = this.reflector.get(CacheKey, context.getHandler())

    if (!cacheKeyFunc) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest<IRequest>()
    const cacheKey = cacheKeyFunc(request)
    const cacheTTL = this.reflector.get(CacheTTL, context.getHandler())

    const cachedValue = await this.cacheService.get(cacheKey)

    if (cachedValue) {
      logger.info(`Cache hit - ${cacheKey}`)

      return of(cachedValue)
    }

    return next.handle().pipe(
      tap((value) => {
        logger.info(`Cache miss - ${cacheKey}`)
        this.cacheService.set(cacheKey, value, cacheTTL)
      }),
    )
  }
}
