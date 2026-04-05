import { pid } from 'node:process'
import { BaseLayout, colorize, LOG_COLORS, LogEvent } from '@tsed/logger'
import { isEmpty } from 'es-toolkit/compat'
import { ClsServiceManager } from 'nestjs-cls'
import { formatTime } from '~shared/utils'

export class CustomConsoleLayout extends BaseLayout {
  transform(logEvent: LogEvent, timezoneOffset?): string {
    const { startTime, level, data } = logEvent
    const cls = ClsServiceManager.getClsService()
    const requestId = cls.getId()
    const [message, rest] = data

    return [
      `[${formatTime(startTime, 'YYYY-MM-DD HH:mm:ss.SSS')}]`,
      `[${pid}]`,
      colorize(`[${level.levelStr}]`, LOG_COLORS[level.toString()]),
      rest?.context ? colorize(`[${rest.context}]`, LOG_COLORS.WARN) : undefined,
      requestId ? colorize(`[${requestId}]`, LOG_COLORS.DEBUG) : undefined,
      `${message}`,
      !isEmpty(rest?.restParams) ? colorize(`\n${rest.restParams}`, LOG_COLORS.OFF) : undefined,
    ]
      .filter(v => v !== undefined)
      .join(' ')
  }
}
