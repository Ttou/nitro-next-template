import type { HealthCheckAttempt } from '@nestjs/terminus'
import type { AlovaInstance } from '~nestjs-modules/alova'
import { Injectable } from '@nestjs/common'
import { HealthIndicatorService } from '@nestjs/terminus'
import { InjectAlova } from '~nestjs-modules/alova'

export interface HttpHealthIndicatorOptions {
  params?: Record<string, any>
  headers?: Record<string, any>
  timeout?: number
}

@Injectable()
export class HttpHealthIndicator {
  constructor(
    @InjectAlova() private readonly alova: AlovaInstance,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  /**
   * 通过 GET 请求探测目标地址的健康状态
   */
  pingCheck<const Key extends string>(
    key: Key,
    url: string,
    options: HttpHealthIndicatorOptions = {},
  ): HealthCheckAttempt<Key> {
    return this.healthIndicatorService
      .check(key)
      .attempt(async () => {
        await this.alova.Get(url, options)

        return { url }
      })
  }
}
