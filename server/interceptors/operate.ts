import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Queue } from 'bullmq'
import type { SysOperateEntity } from '~server/database'
import type { IRequest } from '../interfaces'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { pick } from 'es-toolkit'
import { throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Operate } from '~server/decorators'
import { QueueNameEnum } from '~server/queues'
import { ContextService } from '~server/shared'

@Injectable()
export class OperateInterceptor implements NestInterceptor {
  constructor(
    @InjectQueue(QueueNameEnum.OPERATE) private operateLogQueue: Queue,
    private contextService: ContextService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<IRequest>()

    const operate = this.reflector.get(Operate, context.getHandler())

    // 没有操作日志注解直接跳过
    if (!operate) {
      return next.handle()
    }

    const user = this.contextService.getCurrentUser()
    const controllerName = context.getClass().name
    const handlerName = context.getHandler().name
    const apiOperation = this.reflector.get('swagger/apiOperation', context.getHandler())

    const operateData: Partial<SysOperateEntity> = {
      summary: apiOperation?.summary || '',
      controllerName,
      handlerName,
      requestUrl: req.url,
      requestMethod: req.method,
      requestParams: operate.ignoreRequest
        ? JSON.stringify(pick(req, ['params', 'query', 'body']))
        : JSON.stringify(pick(req, ['params', 'query', 'body'])),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      operateTime: new Date(),
    }

    return next.handle().pipe(
      tap(async (data) => {
        const { operateTime, ...rest } = operateData
        const costTime = Date.now() - operateTime!.getTime()

        this.operateLogQueue.add(
          '',
          {
            ...rest,
            requestResult: operate.ignoreResponse
              ? null
              : JSON.stringify(data),
            user,
            operateTime,
            costTime,
            status: 200,
          },
        )
      }),
      catchError((err) => {
        const { operateTime, ...rest } = operateData
        const costTime = Date.now() - operateTime!.getTime()

        this.operateLogQueue.add(
          '',
          {
            ...rest,
            user,
            operateTime,
            costTime,
            status: err.status || 500,
            errorMsg: err.message,
          },
        )
        return throwError(() => err)
      }),
    )
  }
}
