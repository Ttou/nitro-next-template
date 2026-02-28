import type { ClsStore, Terminal } from 'nestjs-cls'
import type { SysUserEntity } from '../entities'

export interface ICtxClsStore extends ClsStore {
  user: Terminal<SysUserEntity>
}
