import type { components } from './schema'
import { ajax } from '~web/utils'

export const currentUserApi = {
  getInfo(): Promise<CurrentUserGetInfoResDto> {
    return ajax.get('/api/current-user/info')
  },
  getProfile(): Promise<CurrentUserGetProfileResDto> {
    return ajax.get('/api/current-user/profile')
  },
  updateProfile(params: UpdateCurrentUserProfileReqDto) {
    return ajax.post('/api/current-user/updateProfile', params)
  },
  updatePassword(params: UpdateCurrentUserPasswordReqDto) {
    return ajax.post('/api/current-user/updatePassword', params)
  },
}

export type CurrentUserGetInfoResDto = components['schemas']['CurrentUserGetInfoResDto']
export type CurrentUserGetProfileResDto = components['schemas']['CurrentUserGetProfileResDto']
export type UpdateCurrentUserProfileReqDto = components['schemas']['UpdateCurrentUserProfileReqDto']
export type UpdateCurrentUserPasswordReqDto = components['schemas']['UpdateCurrentUserPasswordReqDto']
