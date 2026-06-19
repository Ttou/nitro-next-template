import type { StpInterface } from '@xlt-token/core'
import type { ICtxClsStore } from '~server/interfaces'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { ClsKeyEnum } from '~server/constants'

@Injectable()
export class CustomXltStp implements StpInterface {
  constructor(
    @Inject(forwardRef(() => ClsService)) private clsService: ClsService<ICtxClsStore>,
  ) {}

  async getPermissionList(loginId: string) {
    const user = this.clsService.get(ClsKeyEnum.CURRENT_USER)
    return user.permissions
  }

  async getRoleList(loginId: string) {
    const user = this.clsService.get(ClsKeyEnum.CURRENT_USER)
    return user.roles
  }
}
