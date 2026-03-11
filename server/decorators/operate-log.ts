import { Reflector } from '@nestjs/core'

interface OperateLogOptions {
  ignoreRequest?: boolean
  ignoreResponse?: boolean
}

/**
 * 操作日志装饰器
 */
export const OperateLog = Reflector.createDecorator<OperateLogOptions>({
  key: 'operateLog:value',
})
