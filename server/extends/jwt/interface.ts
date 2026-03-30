import type { Header, Validation } from '@node-rs/jsonwebtoken'
import type { StringValue } from 'ms'

export interface JwtModuleOptions {
  secretKey: string
  expiresIn: StringValue
  header?: Header
  validation?: Validation
}
