import type { ClsStore, Terminal } from 'nestjs-cls'
import { OmitType } from '@nestjs/swagger'
import { ClsKeyEnum } from '~server/constants'
import { SysUserEntityExcludeRelationDto } from '~server/openapi'

export class ContextCurrentUser extends OmitType(SysUserEntityExcludeRelationDto, ['password'] as const) {
  roles: string[]
  permissions: string[]
}

export interface ICtxClsStore extends ClsStore {
  [ClsKeyEnum.CURRENT_USER]: Terminal<ContextCurrentUser>
}
