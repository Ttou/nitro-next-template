import type { ConfigurableModuleOptionsFactory } from '@nestjs/common'
import type { StringValue } from 'ms'

export interface CaptchaModuleOptions {
  keyPrefix?: string
  expire?: StringValue
}

export interface CaptchaModuleOptionsFactory extends ConfigurableModuleOptionsFactory<CaptchaModuleOptions, 'createCaptchaOptions'> {}
