import type { components } from '../schema'
import type { RealRes } from '../type'
import { ajax } from '~web/utils'

export const systemRoleAuthApi = {
  findAllocatedUserPage(params: FindAllocatedUserPageForRoleReqDto): Promise<FindAllocatedUserPageForRoleResDto> {
    return ajax.post('/api/system/role/auth/findAllocatedUserPage', params)
  },
  findUnallocatedUserPage(params: FindUnallocatedUserPageForRoleReqDto): Promise<FindUnallocatedUserPageForRoleResDto> {
    return ajax.post('/api/system/role/auth/findUnallocatedUserPage', params)
  },
  allocateUser(params: AllocateUserForRoleReqDto): Promise<void> {
    return ajax.post('/api/system/role/auth/allocateUser', params)
  },
  unallocateUser(params: UnallocateUserForRoleReqDto): Promise<void> {
    return ajax.post('/api/system/role/auth/unallocateUser', params)
  },
}

export type FindAllocatedUserPageForRoleReqDto = components['schemas']['FindAllocatedUserPageForRoleReqDto']
export type FindAllocatedUserPageForRoleResDto = RealRes<components['schemas']['FindAllocatedUserPageForRoleResDto']>
export type FindUnallocatedUserPageForRoleReqDto = components['schemas']['FindUnallocatedUserPageForRoleReqDto']
export type FindUnallocatedUserPageForRoleResDto = RealRes<components['schemas']['FindUnallocatedUserPageForRoleResDto']>
export type AllocateUserForRoleReqDto = components['schemas']['AllocateUserForRoleReqDto']
export type UnallocateUserForRoleReqDto = components['schemas']['UnallocateUserForRoleReqDto']
