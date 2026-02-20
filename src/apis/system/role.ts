import type { components } from '../schema'
import type { RealRes, RemoveReqDto } from '../type'
import { ajax } from '~web/utils'

export const systemRoleApi = {
  create(params: CreateSystemRoleReqDto) {
    return ajax.post('/api/system/role/create', params)
  },
  update(params: UpdateSystemRoleReqDto) {
    return ajax.post('/api/system/role/update', params)
  },
  remove(params: RemoveReqDto) {
    return ajax.delete('/api/system/role/remove', { data: params })
  },
  findPage(params: FindSystemRolePageReqDto): Promise<FindSystemRolePageResDto> {
    return ajax.post('/api/system/role/findPage', params)
  },
}

export type CreateSystemRoleReqDto = components['schemas']['CreateSystemRoleReqDto']
export type UpdateSystemRoleReqDto = components['schemas']['UpdateSystemRoleReqDto']
export type FindSystemRolePageReqDto = components['schemas']['FindSystemRolePageReqDto']
export type FindSystemRolePageResDto = RealRes<components['schemas']['FindSystemRolePageResDto']>
