import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { ErrorEnum } from '~server/constants'

/**
 * 默认错误处理
 */
@Catch()
export class DefaultFilter implements ExceptionFilter {
  private readonly logger = new Logger(DefaultFilter.name)

  constructor(
    private httpAdapterHost: HttpAdapterHost,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const status = this.getStatus(exception)

    // @ts-ignore
    this.logger.error(exception)

    // 当 HttpException 携带结构化响应体时（如 @nestjs/terminus 的健康检查结果），
    // 直接返回该响应体，避免被统一包装为 { status, message } 而丢失健康检查详情。
    const response = exception instanceof HttpException
      ? exception.getResponse()
      : null

    const body = response !== null && typeof response === 'object'
      ? response
      : {
          status,
          message: this.getMessage(exception),
        }

    httpAdapter.reply(ctx.getResponse(), body, status)
  }

  private getStatus(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.getStatus()
    }
    return exception?.status || HttpStatus.INTERNAL_SERVER_ERROR
  }

  private getMessage(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.message
    }
    return exception?.message || ErrorEnum.label(ErrorEnum.INTERNAL_SERVER_ERROR)
  }
}
