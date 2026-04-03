import { Enum } from 'enum-plus'

export const QueueNameEnum = Enum({
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  OPERATE: 'Operate',
} as const)
