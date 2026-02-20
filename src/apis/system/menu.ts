import type { components } from '../schema'
import type { RemoveReqDto } from '../type'
import { ajax } from '~web/utils'

export const systemMenuApi = {
  findList(params: FindSystemMenuListReqDto): Promise<FindSystemMenuListResDto> {
    return ajax.post('/api/system/menu/findList', params)
  },
  create(params: CreateSystemMenuReqDto) {
    return ajax.post('/api/system/menu/create', params)
  },
  update(params: UpdateSystemMenuReqDto) {
    return ajax.post('/api/system/menu/update', params)
  },
  remove(params: RemoveReqDto) {
    return ajax.delete('/api/system/menu/remove', { data: params })
  },
}

export type FindSystemMenuListReqDto = components['schemas']['FindSystemMenuListReqDto']
export type FindSystemMenuListResDto = components['schemas']['FindSystemMenuListResDto']
export type CreateSystemMenuReqDto = components['schemas']['CreateSystemMenuReqDto']
export type UpdateSystemMenuReqDto = components['schemas']['UpdateSystemMenuReqDto']
