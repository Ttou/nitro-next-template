import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

/**
 * 默认错误处理
 */
@Catch()
export class DefaultFilter implements ExceptionFilter {
  private logger = new Logger(DefaultFilter.name)

  constructor(
    private httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const status = this.getStatus(exception)
    const message = this.getMessage(exception)

    // @ts-ignore
    this.logger.error(message, exception.stack)

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
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  private getMessage(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.message
    }
    return '服务器错误'
  }
}
