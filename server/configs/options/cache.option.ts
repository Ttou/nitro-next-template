import type { CacheModuleOptionsFactory } from '~nestjs-modules/cache'
import type { IConfig } from '../config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CacheModuleOptions implements CacheModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions() {
    return this.configService.getOrThrow<IConfig['cache']>('cache')
  }
}
