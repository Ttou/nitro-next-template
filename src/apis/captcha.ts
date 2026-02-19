import type { components } from './schema'
import { ajax } from '~web/utils'

export const captchaApi = {
  image(): Promise<CaptchaImageResDto> {
    return ajax.get('/api/captcha/image')
  },
}

export type CaptchaImageResDto = components['schemas']['CaptchaImageResDto']
