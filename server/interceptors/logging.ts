import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IRequest } from '../interfaces'
import { Injectable } from '@nestjs/common'
import { tap } from 'rxjs/operators'
import { LoggerService } from '~server/extends'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private loggerService: LoggerService,
  ) {
    this.loggerService.setContext(LoggingInterceptor.name)
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<IRequest>()
    const message = `${req.method} - ${req.path}`

    this.loggerService.log(`Request [${message}]`)

    return next.handle().pipe(
      tap(() => {
        this.loggerService.log(`Response [${message}]`)
      }),
    )
  }
}
