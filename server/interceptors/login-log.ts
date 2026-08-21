import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Queue } from 'bullmq'
import type { IRequest } from '../interfaces'
import { InjectQueue } from '@nestjs/bullmq'
import { HttpStatus, Injectable } from '@nestjs/common'
import { throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { QueueNameEnum } from '~server/queues'

@Injectable()
export class LoginLogInterceptor implements NestInterceptor {
  constructor(
    @InjectQueue(QueueNameEnum.LOGIN_LOG) private loginLogQueue: Queue,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<IRequest>()

    const params = {
      ip: req.ip,
      userName: req.body.userName,
      userAgent: req.headers['user-agent']!,
      operateTime: new Date(),
    }

    return next.handle().pipe(
      tap(async (data) => {
        const { operateTime, ...rest } = params
        const costTime = Date.now() - operateTime!.getTime()

        this.loginLogQueue.add(
          '',
          {
            ...rest,
            token: data,
            operateTime,
            costTime,
            status: HttpStatus.OK,
          },
        )
      }),
      catchError((err) => {
        const { operateTime, ...rest } = params
        const costTime = Date.now() - operateTime!.getTime()

        this.loginLogQueue.add(
          '',
          {
            ...rest,
            operateTime,
            costTime,
            status: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
            errorMsg: err.message,
          },
        )

        return throwError(() => err)
      }),
    )
  }
}
