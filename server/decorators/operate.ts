import { Reflector } from '@nestjs/core'

interface OperateOptions {
  ignoreRequest?: boolean
  ignoreResponse?: boolean
}

/**
 * 操作日志装饰器
 */
export const Operate = Reflector.createDecorator<OperateOptions>({
  key: 'operate:value',
})
