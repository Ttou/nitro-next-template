import type { HealthCheckAttempt } from '@nestjs/terminus'
import type { Queue } from 'bullmq'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { HealthIndicatorService } from '@nestjs/terminus'
import { QueueNameEnum } from '~server/queues'

@Injectable()
export class QueueHealthIndicator {
  constructor(
    @InjectQueue(QueueNameEnum.LOGIN_LOG) private readonly queue: Queue,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  /**
   * 一次只读 getJobCounts 调用成功即视为队列可用：
   * 该调用走 BullMQ 的 Redis 命令，覆盖 Redis 连通、队列前缀与队列可读性。
   */
  pingCheck<const Key extends string>(key: Key): HealthCheckAttempt<Key> {
    return this.healthIndicatorService
      .check(key)
      .attempt(async () => {
        await this.queue.getJobCounts('waiting')

        return { queue: QueueNameEnum.LOGIN_LOG }
      })
      .withTimeout(5_000)
  }
}
