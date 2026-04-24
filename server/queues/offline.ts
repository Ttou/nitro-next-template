import { EntityManager } from '@mikro-orm/core'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { SysOnlineEntity } from '~server/database'
import { QueueNameEnum } from './constant'

@Processor(
  QueueNameEnum.OFFLINE,
  {
    removeOnComplete: {
      age: 2 * 24 * 60 * 1000,
      count: 50,
    },
    removeOnFail: {
      age: 5 * 24 * 60 * 1000,
      count: 50,
    },
  },
)
export class OfflineQueue extends WorkerHost {
  private readonly logger = new Logger(OfflineQueue.name)

  constructor(
    private em: EntityManager,
  ) {
    super()
  }

  async process(job: Job<any>) {
    const { token } = job.data

    const em = this.em.fork()

    try {
      const oldRecord = await em.findOne(SysOnlineEntity, {
        token,
      })

      if (oldRecord) {
        await em.remove(oldRecord).flush()
      }
    }
    catch (error) {
      this.logger.error(error)
    }
  }
}
