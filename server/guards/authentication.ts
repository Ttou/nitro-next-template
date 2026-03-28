import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Public } from '~server/decorators'
import { LogoutService } from '~server/extends'
import { ContextService } from '~server/shared'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private contextService: ContextService,
    private logoutService: LogoutService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(Public, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const token = this.contextService.getToken()

    try {
      const isLogout = await this.logoutService.verify(token)

      if (isLogout) {
        throw new UnauthorizedException('登录凭证已过期，请重新登录')
      }

      const res = await this.jwtService.verify(token, {
        complete: true,
      })

      if (typeof res !== 'string') {
        await this.contextService.setCurrentUser(res.payload)

        return true
      }
    }
    catch (error) {
      throw new UnauthorizedException('登录凭证无效，请重新登录')
    }

    return true
  }
}
