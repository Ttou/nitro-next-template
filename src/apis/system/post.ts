import type { components } from '../schema'
import type { RemoveReqDto } from '../type'
import { ajax } from '~web/utils'

export const systemPostApi = {
  create(params: CreateSystemPostReqDto) {
    return ajax.post('/api/system/post/create', params)
  },
  update(params: UpdateSystemPostReqDto) {
    return ajax.post('/api/system/post/update', params)
  },
  remove(params: RemoveReqDto) {
    return ajax.delete('/api/system/post/remove', { data: params })
  },
  findPage(params: FindSystemPostPageReqDto): Promise<FindSystemPostPageResDto> {
    return ajax.post('/api/system/post/findPage', params)
  },
}

export type CreateSystemPostReqDto = components['schemas']['CreateSystemPostReqDto']
export type UpdateSystemPostReqDto = components['schemas']['UpdateSystemPostReqDto']
export type FindSystemPostPageReqDto = components['schemas']['FindSystemPostPageReqDto']
export type FindSystemPostPageResDto = components['schemas']['FindSystemPostPageResDto']
