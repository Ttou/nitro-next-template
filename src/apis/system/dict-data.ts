import type { components } from '../schema'
import type { RemoveReqDto } from '../type'
import { ajax } from '~web/utils'

export const systemDictDataApi = {
  create(params: CreateSystemDictDataReqDto) {
    return ajax.post('/api/system/dict/data/create', params)
  },
  update(params: UpdateSystemDictDataReqDto) {
    return ajax.post('/api/system/dict/data/update', params)
  },
  remove(params: RemoveReqDto) {
    return ajax.delete('/api/system/dict/data/remove', { data: params })
  },
  findList(params: FindSystemDictDataListReqDto): Promise<FindSystemDictDataListResDto> {
    return ajax.post('/api/system/dict/data/findList', params)
  },
}

export type FindSystemDictDataListReqDto = components['schemas']['FindSystemDictDataListReqDto']
export type FindSystemDictDataListResDto = components['schemas']['FindSystemDictDataListResDto']
export type CreateSystemDictDataReqDto = components['schemas']['CreateSystemDictDataReqDto']
export type UpdateSystemDictDataReqDto = components['schemas']['UpdateSystemDictDataReqDto']
