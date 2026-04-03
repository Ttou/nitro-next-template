import { Enum } from 'enum-plus'

export const ErrorEnum = Enum({
  TOKEN_EXPIRED_ERROR: { value: 'TokenExpiredError', label: '过期签名' },
  JSON_WEB_TOKEN_ERROR: { value: 'JsonWebTokenError', label: '无效签名' },
  NOT_BEFORE_ERROR: { value: 'NotBeforeError', label: '未到生效时间' },
})
