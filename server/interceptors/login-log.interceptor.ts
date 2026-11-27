import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Queue } from 'bullmq'
import type { LoginLogQueueData } from '~server/queues'
import type { IRequest } from '../interfaces'
import { InjectQueue } from '@nestjs/bullmq'
import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { QueueNameEnum } from '~server/queues'

@Injectable()
export class LoginLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoginLogInterceptor.name)

  constructor(
    @InjectQueue(QueueNameEnum.LOGIN_LOG) private loginLogQueue: Queue<LoginLogQueueData>,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<IRequest>()

    const params: Pick<LoginLogQueueData, 'ip' | 'userName' | 'userAgent' | 'operateTime'> = {
      ip: req.ip!,
      userName: req.body.userName,
      userAgent: req.headers['user-agent']!,
      operateTime: new Date(),
    }

    // 入队失败不影响登录响应，但必须消费掉 Promise，避免 unhandled rejection
    const enqueue = (data: LoginLogQueueData) => {
      this.loginLogQueue
        .add('', data)
        .catch(error => this.logger.error(error))
    }

    return next.handle().pipe(
      tap((data) => {
        const { operateTime, ...rest } = params

        enqueue({
          ...rest,
          token: data,
          operateTime,
          costTime: Date.now() - operateTime.getTime(),
          status: HttpStatus.OK,
        })
      }),
      catchError((err) => {
        const { operateTime, ...rest } = params

        enqueue({
          ...rest,
          operateTime,
          costTime: Date.now() - operateTime.getTime(),
          status: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
          errorMsg: err.message,
        })

        return throwError(() => err)
      }),
    )
  }
}
