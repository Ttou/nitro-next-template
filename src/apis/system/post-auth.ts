import type { components } from '../schema'
import type { RealRes } from '../type'
import { ajax } from '~web/utils'

export const systemPostAuthApi = {
  findAllocatedUserPage(params: FindAllocatedUserPageForPostReqDto): Promise<FindAllocatedUserPageForPostResDto> {
    return ajax.post('/api/system/post/auth/findAllocatedUserPage', params)
  },
  findUnallocatedUserPage(params: FindUnallocatedUserPageForPostReqDto): Promise<FindUnallocatedUserPageForPostResDto> {
    return ajax.post('/api/system/post/auth/findUnallocatedUserPage', params)
  },
  allocateUser(params: AllocateUserForPostReqDto) {
    return ajax.post('/api/system/post/auth/allocateUser', params)
  },
  unallocateUser(params: UnallocateUserForPostReqDto) {
    return ajax.post('/api/system/post/auth/unallocateUser', params)
  },
}

export type FindAllocatedUserPageForPostReqDto = components['schemas']['FindAllocatedUserPageForPostReqDto']
export type FindAllocatedUserPageForPostResDto = RealRes<components['schemas']['FindAllocatedUserPageForPostResDto']>
export type FindUnallocatedUserPageForPostReqDto = components['schemas']['FindUnallocatedUserPageForPostReqDto']
export type FindUnallocatedUserPageForPostResDto = RealRes<components['schemas']['FindUnallocatedUserPageForPostResDto']>
export type AllocateUserForPostReqDto = components['schemas']['AllocateUserForPostReqDto']
export type UnallocateUserForPostReqDto = components['schemas']['UnallocateUserForPostReqDto']
