import type { components } from '../schema'
import type { RealRes, RemoveReqDto } from '../type'
import { ajax } from '~web/utils'

export const systemUserApi = {
  create(params: CreateSystemUserReqDto) {
    return ajax.post('/api/system/user/create', params)
  },
  update(params: UpdateSystemUserReqDto) {
    return ajax.post('/api/system/user/update', params)
  },
  remove(params: RemoveReqDto) {
    return ajax.delete('/api/system/user/remove', { data: params })
  },
  findPage(params: FindSystemUserPageReqDto): Promise<FindSystemUserPageResDto> {
    return ajax.post('/api/system/user/findPage', params)
  },
}

export type CreateSystemUserReqDto = components['schemas']['CreateSystemUserReqDto']
export type UpdateSystemUserReqDto = components['schemas']['UpdateSystemUserReqDto']
export type FindSystemUserPageReqDto = components['schemas']['FindSystemUserPageReqDto']
export type FindSystemUserPageResDto = RealRes<components['schemas']['FindSystemUserPageResDto']>
