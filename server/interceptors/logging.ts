import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IRequest } from '../interfaces'
import { Injectable, Logger } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name)

  constructor(
    private clsService: ClsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<IRequest>()
    const requestId = this.clsService.getId()
    const message = `${req.method} - ${req.path}`

    this.logger.log(`Request [${message}]`, requestId)

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`Response [${message}]`, requestId)
      }),
    )
  }
}
