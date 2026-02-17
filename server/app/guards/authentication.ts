import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Public } from '~server/app/decorators'
import { SharedService } from '~server/app/shared'

/**
 * 登录守卫
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly sharedService: SharedService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const isPublic = this.reflector.getAllAndOverride(Public, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const token = this.sharedService.getToken()

    try {
      const res = await this.jwtService.verify(token, {
        complete: true,
      })

      if (typeof res !== 'string') {
        await this.sharedService.setCurrentUser(res.payload)

        return true
      }
    }
    catch (error) {
      throw new UnauthorizedException('Authorization token is invalid')
    }

    return true
  }
}
