export const systemPostAuthApi = {
  findAllocatedUserPage(params: FindAllocatedUserPageForPostDto) {
    return $fetch('/api/system/post/auth/findAllocatedUserPage', { method: 'POST', body: params })
  },
  findUnallocatedUserPage(params: FindUnallocatedUserPageForPostDto) {
    return $fetch('/api/system/post/auth/findUnallocatedUserPage', { method: 'POST', body: params })
  },
  allocateUser(params: AllocateUserForPostDto) {
    return $fetch('/api/system/post/auth/allocateUser', { method: 'POST', body: params })
  },
  unallocateUser(params: UnallocateUserForPostDto) {
    return $fetch('/api/system/post/auth/unallocateUser', { method: 'POST', body: params })
  },
}
