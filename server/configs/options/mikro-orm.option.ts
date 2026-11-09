import type { MikroOrmOptionsFactory } from '@mikro-orm/nestjs'
import type { IConfig } from '../config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MikroOrmModuleOptions implements MikroOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMikroOrmOptions(contextName?: string) {
    return this.configService.getOrThrow<IConfig['mikro-orm']>('mikro-orm')
  }
}
