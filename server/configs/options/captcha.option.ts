import type { CaptchaModuleOptionsFactory } from '~nestjs-modules/captcha'
import type { IConfig } from '../config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CaptchaModuleOptions implements CaptchaModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCaptchaOptions() {
    return this.configService.getOrThrow<IConfig['captcha']>('captcha')
  }
}
