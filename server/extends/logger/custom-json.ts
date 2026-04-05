import { pid } from 'node:process'
import { BaseLayout, LogEvent } from '@tsed/logger'
import { ClsServiceManager } from 'nestjs-cls'
import { formatTime } from '~shared/utils'

export class CustomJsonLayout extends BaseLayout {
  transform(logEvent: LogEvent, timezoneOffset?: any): string {
    const { startTime, level, data } = logEvent
    const cls = ClsServiceManager.getClsService()
    const requestId = cls.getId()
    const [message, rest] = data

    return JSON.stringify({
      time: formatTime(startTime, 'YYYY-MM-DD HH:mm:ss.SSS'),
      pid,
      level: level.levelStr,
      context: rest?.context,
      requestId,
      message,
      restParams: rest?.restParams,
    })
  }
}
