import type { ClsStore, Terminal } from 'nestjs-cls'
import type { SysUserEntity } from '~server/database'

export interface ICtxClsStore extends ClsStore {
  user: Terminal<SysUserEntity>
}
