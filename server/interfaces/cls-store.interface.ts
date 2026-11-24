import type { ClsStore, Terminal } from 'nestjs-cls'
import type { SysUserEntityExcludeRelationDto } from '~db/dtos'
import { ClsKeyEnum } from '~server/constants'

export type ContextCurrentUser = Pick<SysUserEntityExcludeRelationDto, 'id' | 'userName'> & {
  roles: string[]
  permissions: string[]
}

export interface ICtxClsStore extends ClsStore {
  [ClsKeyEnum.CURRENT_USER]: Terminal<ContextCurrentUser>
}
