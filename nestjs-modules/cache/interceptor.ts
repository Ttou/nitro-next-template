import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Injectable, Logger } from '@nestjs/common'
// eslint-disable-next-line ts/consistent-type-imports
import { Reflector } from '@nestjs/core'
import { of, tap } from 'rxjs'
import { CacheKey, CacheTTL } from './decorator'
// eslint-disable-next-line ts/consistent-type-imports
import { CacheService } from './service'

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name)

  constructor(
    private reflector: Reflector,
    private cacheService: CacheService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const cacheKey = this.reflector.get(CacheKey, context.getHandler())

    if (!cacheKey) {
      return next.handle()
    }

    const parsedKey = typeof cacheKey === 'string' ? cacheKey : cacheKey(context)
    const parsedTTL = this.reflector.get(CacheTTL, context.getHandler())

    const cachedValue = await this.cacheService.get(parsedKey)

    if (cachedValue) {
      this.logger.log(`命中缓存: ${parsedKey}`)
      return of(cachedValue)
    }

    return next.handle().pipe(
      tap((value) => {
        this.cacheService.set(parsedKey, value, parsedTTL)
      }),
    )
  }
}
