import type { ConfigurableModuleOptionsFactory } from '@nestjs/common'
import type { StringValue } from 'ms'

export interface CacheModuleOptions {
  keyPrefix?: string
  expire?: StringValue
}

export interface CacheModuleOptionsFactory extends ConfigurableModuleOptionsFactory<CacheModuleOptions, 'createCacheOptions'> {}
