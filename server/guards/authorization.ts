import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ErrorEnum } from '~server/constants'
import { Permission } from '~server/decorators'
import { ContextService } from '~server/shared'

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private contextService: ContextService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const permission = this.reflector.get(Permission, context.getHandler())

    if (!permission) {
      return true
    }

    const hasPermission = await this.contextService.isCurrentUserHasPermission(permission)

    if (!hasPermission) {
      throw new ForbiddenException(ErrorEnum.label(ErrorEnum.FORBIDDEN_ERROR))
    }

    return true
  }
}
