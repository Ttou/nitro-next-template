import { Reflector } from '@nestjs/core'

/**
 * 操作日志装饰器
 */
export const OperateLog = Reflector.createDecorator<boolean>({
  key: 'operateLog:value',
  transform() {
    return true
  },
})
