import type { components } from '../schema'
import type { RealRes, RemoveReqDto } from '../type'
import { ajax } from '~web/utils'

export const systemDeptApi = {
  findList(params: FindSystemDeptListReqDto): Promise<FindSystemDeptListResDto> {
    return ajax.post('/api/system/dept/findList', params)
  },
  create(params: CreateSystemDeptReqDto) {
    return ajax.post('/api/system/dept/create', params)
  },
  update(params: UpdateSystemDeptReqDto) {
    return ajax.post('/api/system/dept/update', params)
  },
  remove(params: RemoveReqDto) {
    return ajax.delete('/api/system/dept/remove', { data: params })
  },
}

export type FindSystemDeptListReqDto = components['schemas']['FindSystemDeptListReqDto']
export type FindSystemDeptListResDto = RealRes<components['schemas']['FindSystemDeptListResDto']>
export type CreateSystemDeptReqDto = components['schemas']['CreateSystemDeptReqDto']
export type UpdateSystemDeptReqDto = components['schemas']['UpdateSystemDeptReqDto']
