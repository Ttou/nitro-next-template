export const systemConfigApi = {
  create(params: CreateSystemConfigDto) {
    return $fetch('/api/system/config/create', { method: 'POST', body: params })
  },
  update(params: UpdateSystemConfigDto) {
    return $fetch('/api/system/config/update', { method: 'POST', body: params })
  },
  remove(params: RemoveDto) {
    return $fetch('/api/system/config/remove', { method: 'DELETE', body: params })
  },
  findPage(params: FindSystemConfigPageDto) {
    return $fetch('/api/system/config/findPage', { method: 'POST', body: params })
  },
}
