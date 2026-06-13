import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { match } from 'ts-pattern'
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
    let message = ''

    console.log(exception)

    match(exception?.response?.name)
      .with(ErrorEnum.TOKEN_EXPIRED_ERROR, async () => {
        message = ErrorEnum.label(ErrorEnum.TOKEN_EXPIRED_ERROR)
      })
      .with(ErrorEnum.JSON_WEB_TOKEN_ERROR, async () => {
        message = ErrorEnum.label(ErrorEnum.JSON_WEB_TOKEN_ERROR)
      })
      .with(ErrorEnum.NOT_BEFORE_ERROR, async () => {
        message = ErrorEnum.label(ErrorEnum.NOT_BEFORE_ERROR)
      })
      .otherwise(() => {
        message = this.getMessage(exception)
      })

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
    return ErrorEnum.label(ErrorEnum.INTERNAL_SERVER_ERROR)
  }
}
