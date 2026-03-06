import type { components, paths } from './schema'
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
export type LoginResDto = paths['/api/auth/login']['post']['responses']['200']['content']['application/json']
