import { cwd } from 'node:process'
import { EntityManager } from '@mikro-orm/core'
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HealthIndicatorService,
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus'
import { XltIgnore } from '@xlt-token/nestjs'
import { RemoteIpService, RemoteTranslateService } from '~server/remote'

@ApiTags('健康检查')
@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthIndicator: HealthIndicatorService,
    private diskHealthIndicator: DiskHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private mikroOrmHealthIndicator: MikroOrmHealthIndicator,
    private remoteIpService: RemoteIpService,
    private remoteTranslateService: RemoteTranslateService,
    private em: EntityManager,
  ) {}

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
      () => this.healthIndicator
        .check('ip-parser')
        .attempt(async () => {
          const location = await this.remoteIpService.toLocation('8.8.8.8')
          if (!location || location === '内网IP')
            throw new Error('IP 解析服务返回结果异常')
          return { location }
        })
        .withTimeout(8_000),
      () => this.healthIndicator
        .check('translate')
        .attempt(async () => {
          const result = await this.remoteTranslateService.trans({
            text: 'hello',
            source: 'en',
            target: 'zh',
            targetKey: 'text',
          })
          if (!result.text)
            throw new Error('翻译服务返回结果异常')
          return { translated: result.text }
        })
        .withTimeout(8_000),
    ])
  }

  private async checkDatabase() {
    // MikroORM v7 默认惰性连接，健康探测前需先确保连接已建立
    const connection = this.em.getConnection()

    await connection.ensureConnection()

    return this.mikroOrmHealthIndicator.pingCheck('database', { connection })
  }
}
