import type { IRequest } from '~server/interfaces'
import type { SysUserEntity } from '~shared/db/entities'
import { Reflector } from '@nestjs/core'

interface OperateOptions {
  ignoreRequest?: boolean
  ignoreResponse?: boolean
  /**
   * 特殊场景下获取用户信息
   */
  getUser?: (req: IRequest) => SysUserEntity
}

/**
 * 操作日志装饰器
 */
export const Operate = Reflector.createDecorator<OperateOptions>({
  key: 'operate:value',
})
