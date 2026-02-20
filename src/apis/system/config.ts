import type { components } from '../schema'
import type { RealRes, RemoveReqDto } from '../type'
import { ajax } from '~web/utils'

export const systemConfigApi = {
  create(params: CreateSystemConfigReqDto) {
    return ajax.post('/api/system/config/create', params)
  },
  update(params: UpdateSystemConfigReqDto) {
    return ajax.post('/api/system/config/update', params)
  },
  remove(params: RemoveReqDto) {
    return ajax.delete('/api/system/config/remove', { data: params })
  },
  findPage(params: FindSystemConfigPageReqDto): Promise<FindSystemConfigPageResDto> {
    return ajax.post('/api/system/config/findPage', params)
  },
}

export type CreateSystemConfigReqDto = components['schemas']['CreateSystemConfigReqDto']
export type UpdateSystemConfigReqDto = components['schemas']['UpdateSystemConfigReqDto']
export type FindSystemConfigPageReqDto = components['schemas']['FindSystemConfigPageReqDto']
export type FindSystemConfigPageResDto = RealRes<components['schemas']['FindSystemConfigPageResDto']>
