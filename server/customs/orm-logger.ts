import type { LogContext, LoggerNamespace } from '@mikro-orm/core'
import { DefaultLogger } from '@mikro-orm/core'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Logger } from '@nestjs/common'

export class CustomOrmLogger extends DefaultLogger {
  private readonly logger = new Logger(MikroOrmModule.name)

  override log(namespace: LoggerNamespace, message: string, context?: LogContext) {
    this.logger.log(this.getMessage(namespace, message))
  }

  override error(namespace: LoggerNamespace, message: string, context?: LogContext) {
    this.logger.error(this.getMessage(namespace, message))
  }

  override warn(namespace: LoggerNamespace, message: string, context?: LogContext) {
    this.logger.warn(this.getMessage(namespace, message))
  }

  private getMessage(namespace: LoggerNamespace, message: string) {
    return [`[${namespace}]`, message].join(' ')
  }
}
