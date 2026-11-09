import type { ConfigurableModuleOptionsFactory } from '@nestjs/common'
import type { BcryptOptions } from 'hash-wasm'

export interface HashModuleOptions {
  bcrypt?: Omit<BcryptOptions, 'password'>
}

export interface HashModuleOptionsFactory extends ConfigurableModuleOptionsFactory<HashModuleOptions, 'createHashOptions'> {}
