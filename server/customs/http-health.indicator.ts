import type { HttpRequestOptions } from '@nestjs/http-client'
import type { HealthCheckAttempt } from '@nestjs/terminus'
import { Injectable } from '@nestjs/common'
import { HttpClient } from '@nestjs/http-client'
import { HealthIndicatorService } from '@nestjs/terminus'

export type HttpHealthIndicatorOptions = Omit<HttpRequestOptions, 'method' | 'signal'>

@Injectable()
export class HttpHealthIndicator {
  constructor(
    private readonly httpClient: HttpClient,
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
      .attempt(async ({ signal }) => {
        const response = await this.httpClient.get(url, {
          ...options,
          signal,
        })

        return {
          statusCode: response.status,
          url: response.url,
        }
      })
  }
}
