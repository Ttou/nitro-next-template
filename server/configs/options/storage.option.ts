import type { StorageOptionsFactory } from '@nestjs/storage'
import type { IConfig } from '../config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StorageModuleOptions implements StorageOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createStorageOptions() {
    return this.configService.getOrThrow<IConfig['storage']>('storage')
  }
}
