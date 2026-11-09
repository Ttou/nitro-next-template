import type { ExcelModuleOptionsFactory } from '~nestjs-modules/excel'
import type { IConfig } from '../config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ExcelModuleOptions implements ExcelModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createExcelOptions() {
    return this.configService.getOrThrow<IConfig['excel']>('excel')
  }
}
