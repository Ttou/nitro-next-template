export const systemDeptApi = {
  findList(params: FindSystemDeptListDto) {
    return $fetch('/api/system/dept/findList', { method: 'POST', body: params })
  },
  create(params: CreateSystemDeptDto) {
    return $fetch('/api/system/dept/create', { method: 'POST', body: params })
  },
  update(params: UpdateSystemDeptDto) {
    return $fetch('/api/system/dept/update', { method: 'POST', body: params })
  },
  remove(params: RemoveDto) {
    return $fetch('/api/system/dept/remove', { method: 'DELETE', body: params })
  },
}
