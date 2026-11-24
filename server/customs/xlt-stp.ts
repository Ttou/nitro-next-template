import type { StpInterface } from '@xlt-token/core'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ContextService } from '~server/context'

@Injectable()
export class CustomXltStp implements StpInterface {
  constructor(
    @Inject(forwardRef(() => ContextService)) private contextService: ContextService,
  ) {}

  async getPermissionList(_loginId: string) {
    const user = this.contextService.getCurrentUser()
    return user.permissions
  }

  async getRoleList(_loginId: string) {
    const user = this.contextService.getCurrentUser()
    return user.roles
  }
}
