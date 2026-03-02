import type { Redis, RedisOptions } from 'ioredis'

export interface RedisModuleOptions extends RedisOptions {}
export interface RedisClient extends Redis {}

export interface IRedisScannerOptions {
  batchSize?: number
  maxKeys?: number
  maxIterations?: number
  delayBetweenBatches?: number
}
