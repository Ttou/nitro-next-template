import { UnauthorizedException } from '@nestjs/common'

export const JwtErrors = {
  InvalidSignature: () => new UnauthorizedException('登录凭证无效，请重新登录', {
    cause: 'jwt.notValid',
  }),
  expiredSignature: () => new UnauthorizedException('登录凭证已过期，请重新登录', {
    cause: 'jwt.expired',
  }),
}
