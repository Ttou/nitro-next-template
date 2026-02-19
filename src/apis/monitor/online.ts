export const monitorOnlineApi = {
  remove(params: RemoveDto) {
    return $fetch('/api/monitor/online/remove', { method: 'DELETE', body: params })
  },
  findPage(params: FindMonitorOnlinePageDto) {
    return $fetch('/api/monitor/online/findPage', { method: 'POST', body: params })
  },
}
