import type { Logger as TsedLogger } from '@tsed/logger'
import type { DateFileAppender } from 'log4js'

export interface LoggerModuleOptions {
  dateFile?: Omit<DateFileAppender, 'type' | 'layout'>
}

export interface Logger extends TsedLogger {}
