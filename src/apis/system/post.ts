export const systemPostApi = {
  create(params: CreateSystemPostDto) {
    return $fetch('/api/system/post/create', { method: 'POST', body: params })
  },
  update(params: UpdateSystemPostDto) {
    return $fetch('/api/system/post/update', { method: 'POST', body: params })
  },
  remove(params: RemoveDto) {
    return $fetch('/api/system/post/remove', { method: 'DELETE', body: params })
  },
  findPage(params: FindSystemPostPageDto) {
    return $fetch('/api/system/post/findPage', { method: 'POST', body: params })
  },
}
