import { EntityManager } from '@mikro-orm/core'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { SysOnlineEntity } from '~server/database'
import { LoggerService } from '~server/extends'
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
  constructor(
    private em: EntityManager,
    private loggerService: LoggerService,
  ) {
    super()
    this.loggerService.setContext(OfflineQueue.name)
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
      this.loggerService.error(error)
    }
  }
}
