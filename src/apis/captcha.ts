import type { paths } from './schema'
import { ajax } from '~web/utils'

export const captchaApi = {
  image(): Promise<ICaptchaImageRes> {
    return ajax.get('/api/captcha/image')
  },
}

export type ICaptchaImageRes = paths['/api/captcha/image']['get']['responses']['200']['content']['application/json']
