import type { HealthCheckAttempt } from '@nestjs/terminus'
import { Injectable } from '@nestjs/common'
import { S3Disk, StorageDisk } from '@nestjs/storage'
import { HealthIndicatorService } from '@nestjs/terminus'

export interface S3HealthIndicatorOptions {
  /** 探测超时（毫秒），默认 5 秒。S3Disk 默认不带超时，健康检查必须显式限时 */
  timeout?: number
}

@Injectable()
export class S3HealthIndicator {
  constructor(
    private readonly disk: StorageDisk,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  /**
   * 通过 ListObjectsV2(max-keys=1) 探测 S3 兼容存储。
   * 一次只读请求同时验证：服务可达、SigV4 凭据有效、目标桶存在且可列举。
   */
  pingCheck<const Key extends string>(
    key: Key,
    options: S3HealthIndicatorOptions = {},
  ): HealthCheckAttempt<Key> {
    const { timeout = 5_000 } = options

    return this.healthIndicatorService
      .check(key)
      .attempt(async () => {
        const signal = AbortSignal.timeout(timeout)

        await this.disk.list({ limit: 1, signal })

        const bucket = this.disk instanceof S3Disk
          ? this.disk.bucket
          : undefined

        return { disk: this.disk.constructor.name, bucket }
      })
  }
}
