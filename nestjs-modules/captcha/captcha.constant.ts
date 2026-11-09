import type { CaptchaModuleOptions } from './captcha.interface'

export const CAPTCHA_REDIS = Symbol('CAPTCHA_REDIS')

export const defaultOptions: Partial<CaptchaModuleOptions> = {
  keyPrefix: 'captcha',
  expire: '30s',
}
