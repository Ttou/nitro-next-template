import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IRequest } from '../interfaces'
import { Injectable } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { tap } from 'rxjs/operators'
import { LoggerService } from '~server/extends'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private clsService: ClsService,
    private loggerService: LoggerService,
  ) {
    this.loggerService.setContext(LoggingInterceptor.name)
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<IRequest>()
    const requestId = this.clsService.getId()
    const message = `${req.method} - ${req.path}`

    this.loggerService.log(`Request [${message}]`, { requestId })

    return next.handle().pipe(
      tap(() => {
        this.loggerService.log(`Response [${message}]`, { requestId })
      }),
    )
  }
}
