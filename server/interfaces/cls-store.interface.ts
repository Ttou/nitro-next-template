import type { ClsStore, Terminal } from 'nestjs-cls'
import { PickType } from '@nestjs/swagger'
import { SysUserEntityExcludeRelationDto } from '~db/dtos'
import { ClsKeyEnum } from '~server/constants'

export class ContextCurrentUser extends PickType(SysUserEntityExcludeRelationDto, ['id', 'userName'] as const) {
  roles: string[]
  permissions: string[]
}

export interface ICtxClsStore extends ClsStore {
  [ClsKeyEnum.CURRENT_USER]: Terminal<ContextCurrentUser>
}
