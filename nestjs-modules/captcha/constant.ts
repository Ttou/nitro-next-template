import type { CaptchaModuleOptions } from './interface'

export const CAPTCHA_REDIS = Symbol('CAPTCHA_REDIS')

export const defaultOptions: Partial<CaptchaModuleOptions> = {
  keyPrefix: 'captcha',
  expire: '30s',
}
