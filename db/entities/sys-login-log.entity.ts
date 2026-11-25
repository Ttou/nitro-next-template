import { defineEntity, p } from '@mikro-orm/core'
import { generateId } from '../../shared/utils/index.ts'

const SysLoginLogEntitySchema = defineEntity({
  name: 'SysLoginLogEntity',
  tableName: 'sys_login_log',
  properties: {
    // 与原来 `type: 'uuid'` 一致：MySQL 里是 varchar(36)
    id: p.string().primary().length(36).onCreate(() => generateId()),
    ip: p.string(),
    location: p.string(),
    userName: p.string(),
    userAgent: p.text(),
    token: p.string().nullable(),
    status: p.integer(),
    errorMsg: p.text().nullable(),
    operateTime: p.datetime(),
    costTime: p.integer(),
  },
})

export class SysLoginLogEntity extends SysLoginLogEntitySchema.class {}

SysLoginLogEntitySchema.setClass(SysLoginLogEntity)
