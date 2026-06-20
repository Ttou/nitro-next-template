import type { StpInterface } from '@xlt-token/core'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ContextService } from '~server/shared'

@Injectable()
export class CustomXltStp implements StpInterface {
  constructor(
    @Inject(forwardRef(() => ContextService)) private contextService: ContextService,
  ) {}

  async getPermissionList(loginId: string) {
    const user = this.contextService.getCurrentUser()
    return user.permissions
  }

  async getRoleList(loginId: string) {
    const user = this.contextService.getCurrentUser()
    return user.roles
  }
}
