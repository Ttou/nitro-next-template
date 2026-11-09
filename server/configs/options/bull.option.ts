import type { SharedBullConfigurationFactory } from '@nestjs/bullmq'
import type { IConfig } from '../config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class BullModuleOptions implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}

  createSharedConfiguration() {
    return this.configService.getOrThrow<IConfig['bull']>('bull')
  }
}
