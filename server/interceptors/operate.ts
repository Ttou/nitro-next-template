import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IRequest } from '../interfaces'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { pick } from 'es-toolkit'
import { throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Operate } from '~server/decorators'
import { SysOperateEntityDto } from '~server/openapi'
import { ContextService } from '~server/shared'

@Injectable()
export class OperateInterceptor implements NestInterceptor {
  constructor(
    private contextService: ContextService,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<IRequest>()

    const operate = this.reflector.get(Operate, context.getHandler())

    // 没有操作日志注解直接跳过
    if (!operate) {
      return next.handle()
    }

    const controllerName = context.getClass().name
    const handlerName = context.getHandler().name
    const apiOperation = this.reflector.get('swagger/apiOperation', context.getHandler())

    const operateData: SysOperateEntityDto = {
      summary: apiOperation?.summary || '',
      controllerName,
      handlerName,
      requestUrl: req.url,
      requestMethod: req.method,
      requestParams: operate.ignoreRequest
        ? JSON.stringify({})
        : JSON.stringify(pick(req, ['params', 'query', 'body'])),
      ip: req.ip,
      userAgent: req.headers['user-agent']!,
      operateTime: new Date(),
    }

    const user = operate.getUser ? operate.getUser(req) : this.contextService.getCurrentUser()

    return next.handle().pipe(
      tap(async (data) => {
        const { operateTime, ...rest } = operateData
        const costTime = Date.now() - operateTime!.getTime()

        this.contextService.addOperate({
          ...rest,
          requestResult: operate.ignoreResponse
            ? null
            : JSON.stringify(data),
          user,
          operateTime,
          costTime,
          status: 200,
        })
      }),
      catchError((err) => {
        const { operateTime, ...rest } = operateData
        const costTime = Date.now() - operateTime!.getTime()

        this.contextService.addOperate({
          ...rest,
          user,
          operateTime,
          costTime,
          status: err.status || 500,
          errorMsg: err.message,
        })

        return throwError(() => err)
      }),
    )
  }
}
