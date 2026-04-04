import { Enum } from 'enum-plus'

export const ErrorEnum = Enum({
  USER_NOT_FOUND_ERROR: { value: 'UserNotFoundError', label: '用户不存在' },
  ACCOUNT_OR_EMAIL_EXIST_ERROR: { value: 'AccountOrEmailExistError', label: '账号或邮箱已存在' },
  ACCOUNT_OR_PASSWORD_ERROR: { value: 'AccountOrPasswordError', label: '账号或密码错误' },
  CAPTCHA_ERROR: { value: 'CaptchaError', label: '验证码错误' },
  PASSWORD_NOT_MATCH_ERROR: { value: 'PasswordNotMatchError', label: '密码不匹配' },
  TOKEN_EXPIRED_ERROR: { value: 'TokenExpiredError', label: '过期签名' },
  JSON_WEB_TOKEN_ERROR: { value: 'JsonWebTokenError', label: '无效签名' },
  NOT_BEFORE_ERROR: { value: 'NotBeforeError', label: '未到生效时间' },
  AUTHORIZATION_NOT_EXIST_ERROR: { value: 'AuthorizationNotExistError', label: 'Authorization 不存在' },
  AUTHORIZATION_FORMAT_ERROR: { value: 'AuthorizationFormatError', label: 'Authorization 格式错误' },
  FORBIDDEN_ERROR: { value: 'ForbiddenError', label: '没有权限访问' },
} as const)
