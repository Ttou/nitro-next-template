import type { Job } from 'bullmq'
import { EntityManager } from '@mikro-orm/mysql'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { HttpStatus, Logger } from '@nestjs/common'
import { SysLoginLogEntity } from '~db/entities'
import { RemoteIpService } from '~server/remote'
import { QueueNameEnum } from './queues.constant'

export interface LoginLogQueueData {
  ip: string
  userName: string
  userAgent: string
  token?: string
  operateTime: Date
  costTime: number
  status: HttpStatus
  errorMsg?: string
}

@Processor(
  QueueNameEnum.LOGIN_LOG,
  {
    removeOnComplete: {
      // KeepJobs.age 单位为秒
      age: 2 * 24 * 60 * 60,
      count: 100,
    },
    removeOnFail: {
      age: 5 * 24 * 60 * 60,
      count: 100,
    },
  },
)
export class LoginLogProcessor extends WorkerHost {
  private readonly logger = new Logger(LoginLogProcessor.name)

  constructor(
    private readonly remoteIpService: RemoteIpService,
    private readonly em: EntityManager,
  ) {
    super()
  }

  async process(job: Job<LoginLogQueueData>) {
    const { ip, ...rest } = job.data
    // 注入的是全局 EM，worker 常驻需按 job fork，避免身份映射无限增长
    const em = this.em.fork()

    let location: string
    try {
      location = await this.remoteIpService.toLocation(ip)
    }
    catch (error) {
      // 解析失败降级为「未知」，避免因此丢掉整条登录日志
      this.logger.error(error)
      location = '未知'
    }

    try {
      const loginLog = em.create(SysLoginLogEntity, {
        ...rest,
        ip,
        location,
      })

      await em.persist(loginLog).flush()
    }
    catch (error) {
      // 交给 BullMQ 重试，最终失败的任务留在 failed 集合便于排查
      this.logger.error(error)
      throw error
    }
  }
}
