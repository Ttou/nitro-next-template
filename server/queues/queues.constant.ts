import type { BullBoardQueueOptions } from '@bull-board/nestjs'
import type { RegisterQueueOptions } from '@nestjs/bullmq'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { Enum } from 'enum-plus'

export const QueueNameEnum = Enum({
  LOGIN_LOG: 'login_log',
  STORAGE_ORPHAN: 'storage_orphan',
} as const)

export const QueueForRegister: RegisterQueueOptions[] = QueueNameEnum.toList().map(item => ({
  name: item.value,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
}))

export const QueueForFeature: BullBoardQueueOptions[] = QueueNameEnum.toList().map(item => ({
  name: item.value,
  adapter: BullMQAdapter,
}))
