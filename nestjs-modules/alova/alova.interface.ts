import type { ConfigurableModuleOptionsFactory } from '@nestjs/common'
import type { Alova, AlovaGenerics, AlovaOptions } from 'alova'

export type AlovaModuleOptions = Partial<AlovaOptions<AlovaGenerics>>

export type AlovaInstance = Alova<AlovaGenerics>

export interface AlovaModuleOptionsFactory extends ConfigurableModuleOptionsFactory<AlovaModuleOptions, 'createAlovaOptions'> {}
