import type { HashModuleOptionsFactory } from '~nestjs-modules/hash'
import type { IConfig } from '../config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class HashModuleOptions implements HashModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createHashOptions() {
    return this.configService.getOrThrow<IConfig['hash']>('hash')
  }
}
