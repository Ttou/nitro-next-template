import { axiosRequestAdapter } from '@alova/adapter-axios'
import { createAlova } from 'alova'
import { ajax } from '~web/utils'
import { createApis, withConfigType } from './createApis'

export const alovaInstance = createAlova({
  baseURL: '',
  requestAdapter: axiosRequestAdapter({
    axios: ajax,
  }),
  cacheFor: null,
})

export const $$userConfigMap = withConfigType({})

const Apis = createApis(alovaInstance, $$userConfigMap)

export default Apis
