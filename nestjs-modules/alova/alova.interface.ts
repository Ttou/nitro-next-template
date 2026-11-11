import type { ConfigurableModuleOptionsFactory } from '@nestjs/common'
import type { Alova, AlovaGenerics, createAlova } from 'alova'

export type AlovaModuleOptions = NonNullable<Parameters<typeof createAlova>[0]>

export type AlovaInstance = Alova<AlovaGenerics>

export interface AlovaModuleOptionsFactory extends ConfigurableModuleOptionsFactory<AlovaModuleOptions, 'createAlovaOptions'> {}
