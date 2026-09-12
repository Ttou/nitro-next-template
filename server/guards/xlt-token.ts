import type { ExecutionContext } from '@nestjs/common'
import type { XltTokenConfig } from '@xlt-token/core'
import { Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { XLT_PERMISSION_KEY, XLT_ROLE_KEY } from '@xlt-token/core'
import { NotPermissionException, NotRoleException, StpLogic, StpPermLogic, XLT_TOKEN_CONFIG, XltAbstractLoginGuard } from '@xlt-token/nestjs'
import { ContextService } from '~server/shared'

@Injectable()
export class XltTokenGuard extends XltAbstractLoginGuard {
  constructor(
    reflector: Reflector,
    @Inject(XLT_TOKEN_CONFIG) config: XltTokenConfig,
    stpLogic: StpLogic,
    private stpPermLogic: StpPermLogic,
    private contextService: ContextService,
  ) {
    super(reflector, config, stpLogic)
  }

  override async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(ctx)

    if (!result) {
      return false
    }

    try {
      const user = this.contextService.getCurrentUser()
      const handler = ctx.getHandler()
      const cls = ctx.getClass()
      const permMeta = this.reflector.getAllAndOverride(XLT_PERMISSION_KEY, [handler, cls])
      if (permMeta)
        await this.stpPermLogic.checkPermission(user.id, permMeta.permissions, permMeta.mode)
      const roleMeta = this.reflector.getAllAndOverride(XLT_ROLE_KEY, [handler, cls])
      if (roleMeta)
        await this.stpPermLogic.checkRole(user.id, roleMeta.roles, roleMeta.mode)
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

  protected override async onAuthSuccess(result, request) {
    await this.contextService.setCurrentUser(result.loginId)
  }

  protected override async onAuthFail(result, request) {
    console.error(result)
  }
}
