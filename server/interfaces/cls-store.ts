import type { ClsStore, Terminal } from 'nestjs-cls'
import type { SysUserEntity } from '~shared/database/entities'
import { ClsKeyEnum } from '~server/constants'

export interface ICtxClsStore extends ClsStore {
  [ClsKeyEnum.CURRENT_USER]: Terminal<SysUserEntity>
}
