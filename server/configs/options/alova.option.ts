import type { AlovaModuleOptionsFactory } from '~nestjs-modules/alova'
import type { IConfig } from '../config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AlovaModuleOptions implements AlovaModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createAlovaOptions() {
    return this.configService.getOrThrow<IConfig['alova']>('alova')
  }
}
