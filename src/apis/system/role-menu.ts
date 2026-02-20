import type { components } from '../schema'
import { ajax } from '~web/utils'

export const systemRoleMenuApi = {
  assign(params: AssignMenuForRoleReqDto) {
    return ajax.post('/api/system/role/menu/assign', params)
  },
  assigned(params: FindAssignedMenuForRoleReqDto) {
    return ajax.post('/api/system/role/menu/assigned', params)
  },
}

export type AssignMenuForRoleReqDto = components['schemas']['AssignMenuForRoleReqDto']
export type FindAssignedMenuForRoleReqDto = components['schemas']['FindAssignedMenuForRoleReqDto']
