import { defineEntity, p } from '@mikro-orm/core'
import { generateId } from '~shared/utils'
import { SysUserEntity } from './sys-user'

const SysOnlineSchema = defineEntity({
  name: 'SysOnlineEntity',
  tableName: 'sys_online',
  properties: {
    id: p.uuid().primary().onCreate(() => generateId()),
    tokenId: p.string(),
    token: p.string(),
    ip: p.string(),
    location: p.string(),
    userAgent: p.string(),
    loginTime: p.datetime(),
    user: () => p.manyToOne(SysUserEntity).joinColumn('user_id'),
  },
})

export class SysOnlineEntity extends SysOnlineSchema.class {}

SysOnlineSchema.setClass(SysOnlineEntity)
