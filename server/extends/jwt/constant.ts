import { Enum } from 'enum-plus'

export { Algorithm } from '@node-rs/jsonwebtoken'

export const JwtErrorEnum = Enum({
  INVALID_SIGNATURE: { label: '登录凭证无效，请重新登录', value: 'InvalidSignature' },
  EXPIRED_SIGNATURE: { label: '登录凭证已过期，请重新登录', value: 'ExpiredSignature' },
})
