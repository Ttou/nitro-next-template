import { Enum } from 'enum-plus'

export const QueueNameEnum = Enum({
  ONLINE_USER: 'OnlineUser',
  OPERATE_LOG: 'OperateLog',
} as const)
