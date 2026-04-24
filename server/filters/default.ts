import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Queue } from 'bullmq'
import { InjectQueue } from '@nestjs/bullmq'
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { match } from 'ts-pattern'
import { ErrorEnum } from '~server/constants'
import { QueueNameEnum } from '~server/queues'
import { ContextService } from '~server/shared'

/**
 * 默认错误处理
 */
@Catch()
export class DefaultFilter implements ExceptionFilter {
  private readonly logger = new Logger(DefaultFilter.name)

  constructor(
    @InjectQueue(QueueNameEnum.OFFLINE) private offlineQueue: Queue,
    private httpAdapterHost: HttpAdapterHost,
    private contextService: ContextService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const status = this.getStatus(exception)
    let message = this.getMessage(exception)

    match(exception?.response?.name)
      .with(ErrorEnum.TOKEN_EXPIRED_ERROR, async () => {
        message = ErrorEnum.label(ErrorEnum.TOKEN_EXPIRED_ERROR)
        const token = this.contextService.getToken()
        await this.offlineQueue.add('', { token })
      })
      .with(ErrorEnum.JSON_WEB_TOKEN_ERROR, async () => {
        message = ErrorEnum.label(ErrorEnum.JSON_WEB_TOKEN_ERROR)
      })
      .with(ErrorEnum.NOT_BEFORE_ERROR, async () => {
        message = ErrorEnum.label(ErrorEnum.NOT_BEFORE_ERROR)
      })
      .exhaustive()

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
