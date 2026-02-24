import type { components, paths } from '../schema'
import type { RealRes, RemoveReqDto } from '../type'
import { ajax } from '~web/utils'

export const systemLangApi = {
  create(params: CreateSystemLangReqDto) {
    return ajax.post('/api/system/lang/create', params)
  },
  update(params: UpdateSystemLangReqDto) {
    return ajax.post('/api/system/lang/update', params)
  },
  remove(params: RemoveReqDto) {
    return ajax.delete('/api/system/lang/remove', { data: params })
  },
  findPage(params: FindSystemLangPageReqDto) {
    return ajax.post('/api/system/lang/findPage', params)
  },
  findByKey(params: FindSystemLangOneReqDto): Promise<FindSystemLangOneResDto> {
    return ajax.get('/api/system/lang/findByKey', { params })
  },
  findAll(params: FindSystemLangAllReqDto): Promise<FindSystemLangAllResDto> {
    return ajax.get('/api/system/lang/findAll', { params })
  },
}

export type CreateSystemLangReqDto = components['schemas']['CreateSystemLangReqDto']
export type UpdateSystemLangReqDto = components['schemas']['UpdateSystemLangReqDto']
export type FindSystemLangPageReqDto = components['schemas']['FindSystemLangPageReqDto']
export type FindSystemLangPageResDto = RealRes<components['schemas']['FindSystemLangPageResDto']>
export type FindSystemLangOneReqDto = paths['/api/system/lang/findByKey']['get']['parameters']['query']
export type FindSystemLangOneResDto = RealRes<components['schemas']['FindSystemLangOneResDto']>
export type FindSystemLangAllReqDto = paths['/api/system/lang/findAll']['get']['parameters']['query']
export type FindSystemLangAllResDto = RealRes<components['schemas']['FindSystemLangAllResDto']>
