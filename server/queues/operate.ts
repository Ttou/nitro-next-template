import { EntityManager } from '@mikro-orm/core'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { forwardRef, Inject, Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { IpService } from '~server/shared'
import { SysOperateEntity, SysUserEntity } from '~shared/db/entities'
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
  private readonly logger = new Logger(OperateQueue.name)

  constructor(
    @Inject(forwardRef(() => IpService)) private ipService: IpService,
    private em: EntityManager,
  ) {
    super()
    this.em = em.fork()
  }

  async process(job: Job<any>) {
    let { user, ip, ...rest } = job.data

    const location = await this.ipService.toLocation(ip)

    // 没有 id 或 userName 表示是特殊操作
    if (!user.userName || !user.id) {
      user = await this.em.findOne(SysUserEntity, {
        id: user.id ? { $eq: user.id } : {},
        userName: user.userName ? { $eq: user.userName } : {},
      })
    }

    try {
      const operateLog = this.em.create(SysOperateEntity, {
        ...rest,
        ip,
        location,
      })
      operateLog.user = user

      await this.em.persist(operateLog).flush()
    }
    catch (error) {
      this.logger.error(error)
    }
  }
}
