import type { XltTokenConfig } from '@xlt-token/core'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { StpLogic, XLT_TOKEN_CONFIG, XltAbstractLoginGuard } from '@xlt-token/nestjs'
import { ContextService } from '~server/shared'

@Injectable()
export class AuthGuard extends XltAbstractLoginGuard {
  private readonly logger = new Logger(AuthGuard.name)

  constructor(
    reflector: Reflector,
    @Inject(XLT_TOKEN_CONFIG) config: XltTokenConfig,
    stpLogic: StpLogic,
    private contextService: ContextService,
  ) {
    super(reflector, config, stpLogic)
  }

  protected override async onAuthSuccess(result, request) {
    await this.contextService.setCurrentUser(result.loginId)
  }

  protected override async onAuthFail(result, request) {
    this.logger.warn('auth.failed', {
      reason: result.reason,
    })
  }
}
