import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { NotPermissionException } from '@xlt-token/nestjs'
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
    const message = this.getMessage(exception)

    // @ts-ignore
    this.logger.error(exception)

    httpAdapter.reply(
      ctx.getResponse(),
      {
        status,
        message,
      },
      status,
    )
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
