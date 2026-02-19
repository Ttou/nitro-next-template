import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Permission } from '~server/app/decorators'
import { SharedService } from '~server/app/shared'

/**
 * 鉴权守卫
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sharedService: SharedService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const permission = this.reflector.get(Permission, context.getHandler())

    if (!permission) {
      return true
    }

    const hasPermission = await this.sharedService.isCurrentUserHasPermission(permission)

    if (!hasPermission) {
      throw new ForbiddenException('没有权限访问')
    }

    return true
  }
}
