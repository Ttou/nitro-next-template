import type ms from 'ms'

export interface CacheModuleOptions {
  /**
   * 缓存键前缀
   * @default "cache"
   */
  keyPrefix?: string
  /**
   * 缓存键前缀分隔符
   * @default ":"
   */
  keyPrefixSeparator?: string
  /**
   * 缓存过期时间
   * @default "15m"
   */
  ttl?: ms.StringValue
}
