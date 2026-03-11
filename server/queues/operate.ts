import { EntityManager } from '@mikro-orm/core'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { SysOperateEntity } from '../entities'
import { QueueNameEnum } from './constant'

@Processor(QueueNameEnum.OPERATE)
export class OperateQueue extends WorkerHost {
  private logger = new Logger(OperateQueue.name)

  constructor(
    private em: EntityManager,
  ) {
    super()
  }

  async process(job: Job<any>) {
    const { user, ...rest } = job.data

    const em = this.em.fork()

    try {
      const operateLog = em.create(SysOperateEntity, rest)
      operateLog.user = user

      await em.persist(operateLog).flush()
    }
    catch (error) {
      this.logger.error(error)
    }
  }
}
