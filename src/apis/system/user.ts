export const systemUserApi = {
  create(params: CreateSystemUserDto) {
    return $fetch('/api/system/user/create', { method: 'POST', body: params })
  },
  update(params: UpdateSystemUserDto) {
    return $fetch('/api/system/user/update', { method: 'POST', body: params })
  },
  remove(params: RemoveDto) {
    return $fetch('/api/system/user/remove', { method: 'DELETE', body: params })
  },
  findPage(params: FindSystemUserPageDto) {
    return $fetch('/api/system/user/findPage', { method: 'POST', body: params })
  },
}
