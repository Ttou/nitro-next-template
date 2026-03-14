import { axiosRequestAdapter } from '@alova/adapter-axios'
import { createAlova } from 'alova'
import { ajax } from '~web/utils'
import { createApis, mountApis, withConfigType } from './createApis'

export const alovaInstance = createAlova({
  baseURL: '',
  requestAdapter: axiosRequestAdapter({
    axios: ajax,
  }),
  cacheFor: null,
})

export const $$userConfigMap = withConfigType({})

const Apis = createApis(alovaInstance, $$userConfigMap)

mountApis(Apis)

export default Apis
