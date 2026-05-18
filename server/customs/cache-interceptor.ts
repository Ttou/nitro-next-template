import { CacheInterceptor } from '@nestjs/cache-manager'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CacheService } from '~server/shared'

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(forwardRef(() => CacheService)) override cacheManager: CacheService,
    override reflector: Reflector,
  ) {
    super(cacheManager, reflector)
  }
}
