import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Public } from '~server/app/decorators'
import { ContextService } from '~server/app/shared'

/**
 * 登录守卫
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private contextService: ContextService,
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
      const res = await this.jwtService.verify(token, {
        complete: true,
      })

      if (typeof res !== 'string') {
        await this.contextService.setCurrentUser(res.payload)

        return true
      }
    }
    catch (error) {
      throw new UnauthorizedException('Authorization token is invalid')
    }

    return true
  }
}
