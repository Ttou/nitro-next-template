import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IRequest } from '~server/interfaces'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { of, tap } from 'rxjs'
import { LoggerService } from '../logger'
import { CacheKey, CacheTTL } from './decorator'
import { CacheService } from './service'

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private cacheService: CacheService,
    private loggerService: LoggerService,
  ) {
    this.loggerService.setContext(CacheInterceptor.name)
  }

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
      this.loggerService.log(`Cache hit: ${cacheKey}`)
      return of(cachedValue)
    }

    return next.handle().pipe(
      tap((value) => {
        this.cacheService.set(cacheKey, value, cacheTTL)
        this.loggerService.log(`Cache set: ${cacheKey}`)
      }),
    )
  }
}
