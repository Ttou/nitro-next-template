export const systemMenuApi = {
  findList(params: FindSystemMenuListDto) {
    return $fetch('/api/system/menu/findList', { method: 'POST', body: params })
  },
  create(params: CreateSystemMenuDto) {
    return $fetch('/api/system/menu/create', { method: 'POST', body: params })
  },
  update(params: UpdateSystemMenuDto) {
    return $fetch('/api/system/menu/update', { method: 'POST', body: params })
  },
  remove(params: RemoveDto) {
    return $fetch('/api/system/menu/remove', { method: 'DELETE', body: params })
  },
}
