import { EntityManager } from '@mikro-orm/core'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { SysOperateEntity } from '~server/database'
import { LoggerService } from '~server/extends'
import { IpService } from '~server/shared'
import { QueueNameEnum } from './constant'

@Processor(
  QueueNameEnum.OPERATE,
  {
    removeOnComplete: {
      age: 2 * 24 * 60 * 1000,
      count: 100,
    },
    removeOnFail: {
      age: 5 * 24 * 60 * 1000,
      count: 100,
    },
  },
)
export class OperateQueue extends WorkerHost {
  constructor(
    private ipService: IpService,
    private em: EntityManager,
    private loggerService: LoggerService,
  ) {
    super()
    this.loggerService.setContext(OperateQueue.name)
  }

  async process(job: Job<any>) {
    const { user, ip, ...rest } = job.data

    const location = await this.ipService.toLocation(ip)
    const em = this.em.fork()

    try {
      const operateLog = em.create(SysOperateEntity, {
        ...rest,
        ip,
        location,
      })
      operateLog.user = user

      await em.persist(operateLog).flush()
    }
    catch (error) {
      this.loggerService.error(error)
    }
  }
}
