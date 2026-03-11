import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Queue } from 'bullmq'
import type { SysOperateLogEntity } from '~server/entities'
import type { IRequest } from '../interfaces'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { pick } from 'es-toolkit'
import { throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { OperateLog } from '~server/decorators'
import { QueueNameEnum } from '~server/queues'
import { ContextService } from '~server/shared'

@Injectable()
export class OperateLogInterceptor implements NestInterceptor {
  constructor(
    @InjectQueue(QueueNameEnum.OPERATE_LOG) private operateLogQueue: Queue,
    private contextService: ContextService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<IRequest>()

    const operateLog = this.reflector.get(OperateLog, context.getHandler())

    // 没有操作日志注解直接跳过
    if (!operateLog) {
      return next.handle()
    }

    const user = this.contextService.getCurrentUser()
    const controllerName = context.getClass().name
    const handlerName = context.getHandler().name
    const apiOperation = this.reflector.get('swagger/apiOperation', context.getHandler())

    const operateData: Partial<SysOperateLogEntity> = {
      summary: apiOperation?.summary || '',
      controllerName,
      handlerName,
      requestIp: req.ip,
      requestMethod: req.method,
      requestUrl: req.url,
      requestParams: operateLog.ignoreRequest
        ? JSON.stringify(pick(req, ['params', 'query', 'body']))
        : JSON.stringify(pick(req, ['params', 'query', 'body'])),
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
            requestResult: operateLog.ignoreResponse
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
