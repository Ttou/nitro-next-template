import type { StpInterface } from '@xlt-token/core'
import type { ClsService } from 'nestjs-cls'
import type { CurrentUserGetInfoResDto } from '~server/apis/current-user/dto'
import type { ICtxClsStore } from '~server/interfaces'
import { Injectable } from '@nestjs/common'
import { uniqBy } from 'es-toolkit'
import { ClsKeyEnum } from '~server/constants'

@Injectable()
export class CustomXltStp implements StpInterface {
  constructor(
    private clsService: ClsService<ICtxClsStore>,
  ) {}

  async getPermissionList(loginId: string) {
    const user = this.clsService.get(ClsKeyEnum.CURRENT_USER) as unknown as CurrentUserGetInfoResDto
    return uniqBy(user.roles.map(role => role.menus).flat(1), menu => menu.id).map(menu => menu.menuKey) || []
  }

  async getRoleList(loginId: string) {
    const user = this.clsService.get(ClsKeyEnum.CURRENT_USER) as unknown as CurrentUserGetInfoResDto
    return user.roles.map(role => role.roleKey) || []
  }
}
