import type { IRedisScannerOptions } from './interface'

export const REDIS_CLIENT = Symbol('redisClient')

export const redisScannerDefaultOptions: IRedisScannerOptions = {
  batchSize: 1000,
  maxIterations: 100,
  maxKeys: 10000,
}
