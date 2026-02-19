export const systemRoleApi = {
  create(params: CreateSystemRoleDto) {
    return $fetch('/api/system/role/create', { method: 'POST', body: params })
  },
  update(params: UpdateSystemRoleDto) {
    return $fetch('/api/system/role/update', { method: 'POST', body: params })
  },
  remove(params: RemoveDto) {
    return $fetch('/api/system/role/remove', { method: 'DELETE', body: params })
  },
  findPage(params: FindSystemRolePageDto) {
    return $fetch('/api/system/role/findPage', { method: 'POST', body: params })
  },
}
