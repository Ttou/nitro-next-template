import type { InferEntity } from '@mikro-orm/core'
import { defineEntity, p } from '@mikro-orm/core'
import { generateId } from '../../shared/utils'

export const SysLoginLogEntity = defineEntity({
  name: 'SysLoginLogEntity',
  tableName: 'sys_login_log',
  properties: {
    id: p.uuid().primary().onCreate(() => generateId()),
    ip: p.string(),
    location: p.string(),
    userName: p.string(),
    userAgent: p.type('text'),
    token: p.string().nullable(),
    status: p.integer(),
    errorMsg: p.type('text').nullable(),
    operateTime: p.datetime(),
    costTime: p.integer(),
  },
})

export type ISysLoginLogEntity = InferEntity<typeof SysLoginLogEntity>
