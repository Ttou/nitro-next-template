export const systemDictTypeApi = {
  create(params: CreateSystemDictTypeDto) {
    return $fetch('/api/system/dict/type/create', { method: 'POST', body: params })
  },
  update(params: UpdateSystemDictTypeDto) {
    return $fetch('/api/system/dict/type/update', { method: 'POST', body: params })
  },
  remove(params: RemoveDto) {
    return $fetch('/api/system/dict/type/remove', { method: 'DELETE', body: params })
  },
  findPage(params: FindSystemDictTypePageDto) {
    return $fetch('/api/system/dict/type/findPage', { method: 'POST', body: params })
  },
  findByKey(params: FindSystemDictDetailByKeyDto) {
    return $fetch('/api/system/dict/type/findByKey', { method: 'GET', params })
  },
}
