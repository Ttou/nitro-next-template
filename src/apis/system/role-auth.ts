export const systemRoleAuthApi = {
  findAllocatedUserPage(params: FindAllocatedUserPageForRoleDto) {
    return $fetch('/api/system/role/auth/findAllocatedUserPage', { method: 'POST', body: params })
  },
  findUnallocatedUserPage(params: FindUnallocatedUserPageForRoleDto) {
    return $fetch('/api/system/role/auth/findUnallocatedUserPage', { method: 'POST', body: params })
  },
  allocateUser(params: AllocateUserForRoleDto) {
    return $fetch('/api/system/role/auth/allocateUser', { method: 'POST', body: params })
  },
  unallocateUser(params: UnallocateUserForRoleDto) {
    return $fetch('/api/system/role/auth/unallocateUser', { method: 'POST', body: params })
  },
}
