import { EntityManager } from '@mikro-orm/core'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { SysOperateLogEntity } from '../entities'
import { QueueNameEnum } from './constant'

@Processor(QueueNameEnum.OPERATE_LOG)
export class OperateLogQueue extends WorkerHost {
  private logger = new Logger(OperateLogQueue.name)

  constructor(
    private em: EntityManager,
  ) {
    super()
  }

  async process(job: Job<any>) {
    const { user, ...rest } = job.data

    const em = this.em.fork()

    try {
      const operateLog = em.create(SysOperateLogEntity, rest)
      operateLog.user = user

      await em.persist(operateLog).flush()
    }
    catch (error) {
      this.logger.error(error)
    }
  }
}
