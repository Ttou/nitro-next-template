import type { BullBoardQueueOptions } from '@bull-board/nestjs'
import type { RegisterQueueOptions } from '@nestjs/bullmq'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { Enum } from 'enum-plus'

export const QueueNameEnum = Enum({
  LOGIN_LOG: 'login_log',
} as const)

export const QueueForRegister: RegisterQueueOptions[] = QueueNameEnum.toList().map(item => ({
  name: item.value,
}))

export const QueueForFeature: BullBoardQueueOptions[] = QueueNameEnum.toList().map(item => ({
  name: item.value,
  adapter: BullMQAdapter,
}))
