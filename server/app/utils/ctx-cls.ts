import type { ClsStore } from 'nestjs-cls'
import type { SysUserEntity } from '../entities'

export interface CtxClsStore extends ClsStore {
  user: SysUserEntity
}
