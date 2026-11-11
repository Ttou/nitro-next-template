import type { AlovaModuleOptions } from './alova.interface'
import { Module } from '@nestjs/common'
import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import { ALOVA_INSTANCE } from './alova.constant'
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './alova.module-define'

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

@Module({
  providers: [
    {
      provide: ALOVA_INSTANCE,
      useFactory: (options: AlovaModuleOptions) => createAlova({
        ...options,
        requestAdapter: options.requestAdapter ?? adapterFetch(),
        cacheFor: options.cacheFor ?? null,
        responded: options.responded ?? { onSuccess },
      }),
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [ALOVA_INSTANCE],
})
export class AlovaModule extends ConfigurableModuleClass {}
