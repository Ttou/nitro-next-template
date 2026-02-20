import type { components } from '../schema'
import type { RealRes, RemoveReqDto } from '../type'
import { ajax } from '~web/utils'

export const monitorOnlineApi = {
  remove(params: RemoveReqDto) {
    return ajax.delete('/api/monitor/online/remove', { data: params })
  },
  findPage(params: FindMonitorOnlinePageReqDto): Promise<FindMonitorOnlinePageResDto> {
    return ajax.post('/api/monitor/online/findPage', params)
  },
}

export type FindMonitorOnlinePageReqDto = components['schemas']['FindMonitorOnlinePageReqDto']
export type FindMonitorOnlinePageResDto = RealRes<components['schemas']['FindMonitorOnlinePageResDto']>
