export const systemDictDataApi = {
  create(params: CreateSystemDictDataDto) {
    return $fetch('/api/system/dict/data/create', { method: 'POST', body: params })
  },
  update(params: UpdateSystemDictDataDto) {
    return $fetch('/api/system/dict/data/update', { method: 'POST', body: params })
  },
  remove(params: RemoveDto) {
    return $fetch('/api/system/dict/data/remove', { method: 'DELETE', body: params })
  },
  findList(params: FindSystemDictDataListDto) {
    return $fetch('/api/system/dict/data/findList', { method: 'POST', body: params })
  },
}
