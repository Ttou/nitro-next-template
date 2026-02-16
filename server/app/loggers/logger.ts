import type { LogEvent } from '@tsed/logger'
import { Logger } from '@tsed/logger'
import { PatternLayout } from '@tsed/logger-pattern-layout'
import { StdoutAppender } from '@tsed/logger-std'
import { formatTime } from '~shared/utils'

const logger = new Logger()

logger.appenders.set('console', {
  type: StdoutAppender,
  level: ['debug', 'info', 'trace', 'fatal', 'error', 'warn'],
  layout: {
    type: PatternLayout,
    pattern: '%x{time} [%z] [%h] %[[%p]%] %x{message}',
    tokens: {
      time: (logEvent: LogEvent) => {
        return `[${formatTime(logEvent.startTime, 'YYYY-MM-DD HH:mm:ss.SSS')}]`
      },
      message: (logEvent: LogEvent) => {
        const [message, rest] = logEvent.data
        const eventArr = []

        // if (isEvent(rest?.event)) {
        //   const { event } = rest as { event: H3Event }

        //   rest[0] = event.context.reqId
        //   eventArr.push(
        //     `[${event.method} - ${event.path}]`,
        //   )
        // }

        return [
          rest?.['0'] ? `[${rest['0']}]` : undefined,
          ...eventArr,
          `${message}`,
        ]
          .filter(v => v !== undefined)
          .join(' ')
      },
    },
  },
})

export { logger }
