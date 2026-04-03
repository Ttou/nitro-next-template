import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { ErrorEnum } from '~server/constants'
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
        throw new UnauthorizedException(ErrorEnum.label(ErrorEnum.TOKEN_EXPIRED_ERROR))
      }

      const res = await this.jwtService.verify(token)
      await this.contextService.setCurrentUser(res)
    }
    catch (error) {
      throw new UnauthorizedException(error)
    }

    return true
  }
}
