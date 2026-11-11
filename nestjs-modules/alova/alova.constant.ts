import type { AlovaModuleOptions } from './alova.interface'
import adapterFetch from 'alova/fetch'

export const ALOVA_INSTANCE = Symbol('ALOVA_INSTANCE')

async function parseBody(response: Response) {
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

async function onSuccess(response: Response) {
  const data = await parseBody(response)

  if (!response.ok) {
    let message = response.statusText

    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      message = data.message
    }
    else if (typeof data === 'string' && data) {
      message = data
    }

    throw new Error(message || `请求失败: ${response.status}`)
  }

  return data
}

export const defaultOptions: AlovaModuleOptions = {
  requestAdapter: adapterFetch(),
  cacheFor: null,
  responded: { onSuccess },
}
