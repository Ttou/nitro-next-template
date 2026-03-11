import { Enum } from 'enum-plus'

export const QueueNameEnum = Enum({
  ONLINE: 'Online',
  OPERATE: 'Operate',
} as const)
