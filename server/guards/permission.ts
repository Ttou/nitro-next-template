import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { XLT_PERMISSION_KEY, XLT_ROLE_KEY } from '@xlt-token/core'
import { NotPermissionException, NotRoleException, StpPermLogic } from '@xlt-token/nestjs'
import { ContextService } from '~server/shared'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private stpPermLogic: StpPermLogic,
    private contextService: ContextService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      if (this.stpPermLogic) {
        const user = this.contextService.getCurrentUser()
        const handler = context.getHandler()
        const cls = context.getClass()
        const permMeta = this.reflector.getAllAndOverride(XLT_PERMISSION_KEY, [handler, cls])
        if (permMeta)
          await this.stpPermLogic.checkPermission(user.id, permMeta.permissions, permMeta.mode)
        const roleMeta = this.reflector.getAllAndOverride(XLT_ROLE_KEY, [handler, cls])
        if (roleMeta)
          await this.stpPermLogic.checkRole(user.id, roleMeta.roles, roleMeta.mode)
      }
    }
    catch (error) {
      if (error instanceof NotPermissionException)
        throw new NotPermissionException(error.permission, error.mode)
      if (error instanceof NotRoleException)
        throw new NotRoleException(error.role, error.mode)
      throw error
    }
    return true
  }
}
