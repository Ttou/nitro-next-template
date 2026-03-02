import type { Redis, RedisOptions } from 'ioredis'

export interface RedisModuleOptions extends RedisOptions {}
export interface RedisClient extends Redis {}

export interface IRedisScannerOptions {
  /**
   * 每次扫描的键数量
   * @default 1000
   */
  batchSize?: number
  /**
   * 最大扫描键数量
   * @default 10000
   */
  maxKeys?: number
  /**
   * 最大扫描迭代次数
   * @default 100
   */
  maxIterations?: number
  /**
   * 每次扫描之间的延迟时间（毫秒）
   * @default 0
   */
  delayBetweenBatches?: number
}
