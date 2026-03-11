import type { components } from '../schema'
import { ajax } from '~web/utils'

export const monitorOperateApi = {
  findPage(params: FindMonitorOperatePageReqDto): Promise<FindMonitorOperatePageResDto> {
    return ajax.post('/api/monitor/operate/findPage', params)
  },
}

export type FindMonitorOperatePageReqDto = components['schemas']['FindMonitorOperatePageReqDto']
export type FindMonitorOperatePageResDto = components['schemas']['FindMonitorOperatePageResDto']
