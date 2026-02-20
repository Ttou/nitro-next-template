import type { components } from './schema'
import type { RealRes } from './type'
import { ajax } from '~web/utils'

export const captchaApi = {
  image(): Promise<CaptchaImageResDto> {
    return ajax.get('/api/captcha/image')
  },
}

export type CaptchaImageResDto = RealRes<components['schemas']['CaptchaImageResDto']>
