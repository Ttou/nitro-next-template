import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IRequest } from '../interfaces'
import { Injectable } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { tap } from 'rxjs/operators'
import { logger } from '../loggers'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly clsService: ClsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<IRequest>()
    const requestId = this.clsService.getId()
    const message = `${req.method} - ${req.path}`

    logger.info(`Request [${message}]`, { 0: LoggingInterceptor.name, requestId })

    return next.handle().pipe(
      tap(() => {
        logger.info(`Response [${message}]`, { 0: LoggingInterceptor.name, requestId })
      }),
    )
  }
}
