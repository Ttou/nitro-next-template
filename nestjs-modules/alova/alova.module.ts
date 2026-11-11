import type { AlovaModuleOptions } from './alova.interface'
import { Module } from '@nestjs/common'
import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import { ALOVA_INSTANCE } from './alova.constant'
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './alova.module-define'

@Module({
  providers: [
    {
      provide: ALOVA_INSTANCE,
      useFactory: (options: AlovaModuleOptions) => createAlova({
        requestAdapter: adapterFetch(),
        ...options,
      }),
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [ALOVA_INSTANCE],
})
export class AlovaModule extends ConfigurableModuleClass {}
