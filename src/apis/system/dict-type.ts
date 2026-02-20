import type { components, paths } from '../schema'
import type { RemoveReqDto } from '../type'
import { ajax } from '~web/utils'

export const systemDictTypeApi = {
  create(params: CreateSystemDictTypeReqDto) {
    return ajax.post('/api/system/dict/type/create', params)
  },
  update(params: UpdateSystemDictTypeReqDto) {
    return ajax.post('/api/system/dict/type/update', params)
  },
  remove(params: RemoveReqDto) {
    return ajax.delete('/api/system/dict/type/remove', { data: params })
  },
  findPage(params: FindSystemDictTypePageReqDto) {
    return ajax.post('/api/system/dict/type/findPage', params)
  },
  findByKey(params: FindSystemDictDetailByKeyReqDto) {
    return ajax.get('/api/system/dict/type/findByKey', { params })
  },
}

export type CreateSystemDictTypeReqDto = components['schemas']['CreateSystemDictTypeReqDto']
export type UpdateSystemDictTypeReqDto = components['schemas']['UpdateSystemDictTypeReqDto']
export type FindSystemDictTypePageReqDto = components['schemas']['FindSystemDictTypePageReqDto']
export type FindSystemDictDetailByKeyReqDto = paths['/api/system/dict/type/findByKey']['get']['parameters']['query']
