import { defineEntity, p } from '@mikro-orm/core'
import { generateId } from '~shared/utils'
import { SysUserEntity } from './sys-user'

const SysOperateSchema = defineEntity({
  name: 'SysOperateEntity',
  tableName: 'sys_operate',
  properties: {
    id: p.uuid().primary().onCreate(() => generateId()),
    summary: p.string(),
    controllerName: p.string(),
    handlerName: p.string(),
    requestMethod: p.string(),
    requestUrl: p.string(),
    requestParams: p.string().nullable(),
    requestResult: p.string().nullable(),
    ip: p.string(),
    location: p.string(),
    userAgent: p.type('text'),
    status: p.integer(),
    errorMsg: p.string().nullable(),
    operateTime: p.datetime(),
    costTime: p.integer(),
    user: () => p.manyToOne(SysUserEntity).joinColumn('user_id'),
  },
})

export class SysOperateEntity extends SysOperateSchema.class {}

SysOperateSchema.setClass(SysOperateEntity)
