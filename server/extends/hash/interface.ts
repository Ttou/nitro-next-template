import type { BcryptOptions } from 'hash-wasm'

export interface HashModuleOptions {
  bcrypt?: Omit<BcryptOptions, 'password'>
}
