import type { SysUserEntity } from '~db/entities/sys-user.entity'
import type { EntityDtoSchema } from './entity-constraint'
import { z } from 'zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, enumField, lazySchema } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统用户（不含关联）
 */
export const sysUserEntityExcludeRelationSchema = lazySchema(() => ((baseEntitySchema().extend({
  userName: z.string().describe('账号'),
  nickName: z.string().describe('昵称'),
  password: z.string().describe('密码'),
  email: z.string().nullish().describe('邮箱'),
  phone: z.string().nullish().describe('手机号码'),
  sex: z.string().nullish().describe('性别'),
  avatar: z.string().nullish().describe('头像'),
  isAvailable: enumField(YesOrNoEnumValues).describe('是否可用'),
  isDelete: enumField(YesOrNoEnumValues).describe('是否删除'),
  remark: z.string().nullish().describe('备注'),
})) satisfies EntityDtoSchema<SysUserEntity>))

export type SysUserEntityExcludeRelationDto = z.infer<ReturnType<typeof sysUserEntityExcludeRelationSchema>>

/**
 * 系统用户（不含关联、不含密码）
 */
export const sysUserEntityNoPasswordSchema = lazySchema(() => sysUserEntityExcludeRelationSchema().omit({ password: true }))

export type SysUserEntityNoPasswordDto = z.infer<ReturnType<typeof sysUserEntityNoPasswordSchema>>

/**
 * 系统用户分页项
 */
export const sysUserEntityNoRelationsNoPasswordSchema = lazySchema(() => defineSchema(sysUserEntityNoPasswordSchema(), { id: 'SysUserEntityNoRelationsNoPasswordDto' }))

export type SysUserEntityNoRelationsNoPasswordDto = z.infer<ReturnType<typeof sysUserEntityNoRelationsNoPasswordSchema>>
