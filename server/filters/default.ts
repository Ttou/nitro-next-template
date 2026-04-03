import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Queue } from 'bullmq'
import { InjectQueue } from '@nestjs/bullmq'
import { Catch, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { ErrorEnum } from '~server/constants'
import { LoggerService } from '~server/extends'
import { QueueNameEnum } from '~server/queues'
import { ContextService } from '~server/shared'

/**
 * 默认错误处理
 */
@Catch()
export class DefaultFilter implements ExceptionFilter {
  constructor(
    @InjectQueue(QueueNameEnum.OFFLINE) private offlineQueue: Queue,
    private httpAdapterHost: HttpAdapterHost,
    private loggerService: LoggerService,
    private contextService: ContextService,
  ) {
    this.loggerService.setContext(DefaultFilter.name)
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const status = this.getStatus(exception)
    const message = this.getMessage(exception)

    // @ts-ignore
    this.loggerService.error(message, exception.stack)

    // @ts-ignore
    if (exception?.response?.name === ErrorEnum.TOKEN_EXPIRED_ERROR) {
      const token = this.contextService.getToken()
      await this.offlineQueue.add('', { token })
    }

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
