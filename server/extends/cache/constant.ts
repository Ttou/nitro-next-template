import type { CacheModuleOptions } from './interface'

export const defaultOptions: CacheModuleOptions = {
  keyPrefix: 'cache',
  keyPrefixSeparator: ':',
  ttl: '15m',
}
