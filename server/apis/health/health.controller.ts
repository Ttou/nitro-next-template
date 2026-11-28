import { EntityManager } from '@mikro-orm/core'
import { Controller, Get } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus'
import { XltIgnore } from '@xlt-token/nestjs'
import { HttpHealthIndicator, QueueHealthIndicator, S3HealthIndicator } from '~server/customs'
import { UrlEnum } from '~server/enums'

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private mikroOrmHealthIndicator: MikroOrmHealthIndicator,
    private httpHealthIndicator: HttpHealthIndicator,
    private s3HealthIndicator: S3HealthIndicator,
    private queueHealthIndicator: QueueHealthIndicator,
    private em: EntityManager,
  ) {}

  @ApiExcludeEndpoint()
  @HealthCheck()
  @XltIgnore()
  @Get()
  check() {
    return this.health.check([
      () => this.checkDatabase(),
      () => this.s3HealthIndicator.pingCheck('s3', { timeout: 5_000 }),
      () => this.queueHealthIndicator.pingCheck('queues'),
      () => this.memoryHealthIndicator.checkHeap('memory', 512 * 1024 * 1024),
      () => this.httpHealthIndicator.pingCheck('ip-parser', UrlEnum.IP_PARSER, { timeout: 8_000 }),
    ])
  }

  private async checkDatabase() {
    // MikroORM v7 默认惰性连接，健康探测前需先确保连接已建立
    const connection = this.em.getConnection()

    await connection.ensureConnection()

    return this.mikroOrmHealthIndicator.pingCheck('database', { connection })
  }
}
