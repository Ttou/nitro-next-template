import { cwd } from 'node:process'
import { EntityManager } from '@mikro-orm/core'
import { Controller, Get } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus'
import { XltIgnore } from '@xlt-token/nestjs'
import { UrlEnum } from '~server/constants'
import { HttpHealthIndicator } from '~server/customs'

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private diskHealthIndicator: DiskHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private mikroOrmHealthIndicator: MikroOrmHealthIndicator,
    private httpHealthIndicator: HttpHealthIndicator,
    private em: EntityManager,
  ) {}

  @ApiExcludeEndpoint()
  @HealthCheck()
  @XltIgnore()
  @Get()
  check() {
    return this.health.check([
      () => this.checkDatabase(),
      () => this.diskHealthIndicator.checkStorage('disk', {
        path: cwd(),
        thresholdPercent: 0.9,
      }),
      () => this.memoryHealthIndicator.checkHeap('memory', 512 * 1024 * 1024),
      () => this.httpHealthIndicator.pingCheck('ip-parser', UrlEnum.IP_PARSER, {
        query: { ip: '8.8.8.8' },
        timeout: 8_000,
      }),
      () => this.httpHealthIndicator.pingCheck('translate', UrlEnum.TRANSLATE, {
        query: {
          text: 'hello',
          source: 'en',
          target: 'zh',
          targetKey: 'text',
        },
        timeout: 8_000,
      }),
    ])
  }

  private async checkDatabase() {
    // MikroORM v7 默认惰性连接，健康探测前需先确保连接已建立
    const connection = this.em.getConnection()

    await connection.ensureConnection()

    return this.mikroOrmHealthIndicator.pingCheck('database', { connection })
  }
}
