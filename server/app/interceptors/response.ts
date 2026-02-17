import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { HttpStatus, Injectable } from '@nestjs/common'
import { map } from 'rxjs'

/**
 * 响应拦截器
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => ({
        timestamp: Date.now(),
        status: HttpStatus.OK,
        data,
      })),
    )
  }
}
