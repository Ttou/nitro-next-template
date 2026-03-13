import type { Logger } from '@tsed/logger'
import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common'
import { LOGGER } from './constant'

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  @Inject(LOGGER) private logger: Logger

  override log(message: any, optionalParams?: any) {
    this.logger.info(message, this.getRestData(optionalParams))
  }

  override error(message: any, optionalParams?: any) {
    this.logger.error(message, this.getRestData(optionalParams))
  }

  override warn(message: any, optionalParams?: any) {
    this.logger.warn(message, this.getRestData(optionalParams))
  }

  override debug(message: any, optionalParams?: any) {
    this.logger.debug(message, this.getRestData(optionalParams))
  }

  override verbose(message: any, optionalParams?: any) {
    this.logger.trace(message, this.getRestData(optionalParams))
  }

  override fatal(message: any, optionalParams?: any) {
    this.logger.fatal(message, this.getRestData(optionalParams))
  }

  private getRestData(optionalParams?: any) {
    return this.context
      ? { context: this.context, ...optionalParams }
      : { context: optionalParams }
  }
}
