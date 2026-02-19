export const systemLangApi = {
  create(params: CreateSystemLangDto) {
    return $fetch('/api/system/lang/create', { method: 'POST', body: params })
  },
  update(params: UpdateSystemLangDto) {
    return $fetch('/api/system/lang/update', { method: 'POST', body: params })
  },
  remove(params: RemoveDto) {
    return $fetch('/api/system/lang/remove', { method: 'DELETE', body: params })
  },
  findPage(params: FindSystemLangPageDto) {
    return $fetch('/api/system/lang/findPage', { method: 'POST', body: params })
  },
  findByKey(params: FindSystemLangOneDto) {
    return $fetch('/api/system/lang/findByKey', { method: 'GET', params })
  },
  findAll(params: FindSystemLangAllDto) {
    return $fetch('/api/system/lang/findAll', { method: 'GET', params })
  },
}
