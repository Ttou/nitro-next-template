import type { RedisModuleOptionsFactory } from '@nestjs-modules/ioredis'
import type { IConfig } from '../config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RedisModuleOptions implements RedisModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createRedisModuleOptions() {
    return this.configService.getOrThrow<IConfig['redis']>('redis')
  }
}
