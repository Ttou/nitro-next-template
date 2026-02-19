import type { components } from './schema'
import { ajax } from '~web/utils'

export const authApi = {
  login(params: LoginReqDto): Promise<LoginResDto> {
    return ajax.post('/api/auth/login', params)
  },
  logout() {
    return ajax.post('/api/auth/logout')
  },
}

export type LoginReqDto = components['schemas']['LoginReqDto']
export type LoginResDto = components['schemas']['LoginResDto']
