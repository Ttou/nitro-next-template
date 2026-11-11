import type { AlovaModuleOptions } from './alova.interface'
import { Module } from '@nestjs/common'
import { createAlova } from 'alova'
import { ALOVA_INSTANCE, defaultOptions } from './alova.constant'
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './alova.module-define'

@Module({
  providers: [
    {
      provide: ALOVA_INSTANCE,
      useFactory: (options: AlovaModuleOptions) => createAlova(Object.assign({}, defaultOptions, options)),
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [ALOVA_INSTANCE],
})
export class AlovaModule extends ConfigurableModuleClass {}
