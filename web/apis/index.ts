import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import { ElMessage } from 'element-plus'
import { omitBy } from 'es-toolkit/compat'
import { t } from '~web/i18n'
import { useUserStore } from '~web/store'
import { createApis, mountApis, withConfigType } from './createApis'

function isPlainData(data: unknown): data is Record<string, any> {
  return Object.prototype.toString.call(data) === '[object Object]'
}

function omitEmpty(data: Record<string, any>) {
  return omitBy(data, v => v === null || v === undefined || v === '')
}

function showError(message: string, status?: number) {
  ElMessage.error({
    message,
    duration: 1500,
    onClose: () => {
      if (status === 401) {
        const userStore = useUserStore()

        userStore.clear().then(() => {
          location.reload()
        })
      }
    },
  })
}

async function readBody(response: Response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  }
  catch {
    return text
  }
}

async function parseErrorBody(response: Response) {
  const body = await readBody(response)

  if (typeof body === 'object' && body !== null) {
    return body
  }

  return { message: body || response.statusText }
}

export const alovaInstance = createAlova({
  baseURL: '',
  requestAdapter: adapterFetch(),
  cacheFor: null,
  beforeRequest: (method) => {
    const userStore = useUserStore()

    if (userStore.token) {
      method.config.headers.Authorization = `Bearer ${userStore.token}`
    }

    if (!method.config.keepEmpty) {
      if (isPlainData(method.config.params)) {
        method.config.params = omitEmpty(method.config.params)
      }
      if (isPlainData(method.data)) {
        method.data = omitEmpty(method.data)
      }
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      if (!response.ok) {
        const data = await parseErrorBody(response)
        const message = data.message || response.statusText

        showError(message, data.status ?? response.status)
        throw new Error(message)
      }

      if (method.config.responseType === 'blob') {
        return response
      }

      return readBody(response)
    },
    onError: (error) => {
      if (error instanceof Error) {
        showError(error.message)
      }
      else {
        showError(t('common.message.networkError'))
      }

      throw error
    },
  },
})

export const $$userConfigMap = withConfigType({})

const Apis = createApis(alovaInstance, $$userConfigMap)

mountApis(Apis)

export default Apis
