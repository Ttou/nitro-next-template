import type { CacheModuleOptions } from './interface'

export const CACHE_REDIS = Symbol('CACHE_REDIS')

export const defaultOptions: CacheModuleOptions = {
  keyPrefix: 'cache',
  expire: '1h',
}
