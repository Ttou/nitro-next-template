import type { SysUserEntity } from '../entities/sys-user.entity'
import type { EntityDtoSchema } from './entity-constraint'
import { z } from 'zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { enumField } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统用户（不含关联）
 */
export const sysUserEntityExcludeRelationSchema = baseEntitySchema.extend({
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
}) satisfies EntityDtoSchema<SysUserEntity>

export type SysUserEntityExcludeRelationDto = z.infer<typeof sysUserEntityExcludeRelationSchema>

/**
 * 系统用户（不含关联、不含密码）
 */
export const sysUserEntityNoPasswordSchema = sysUserEntityExcludeRelationSchema.omit({ password: true })

export type SysUserEntityNoPasswordDto = z.infer<typeof sysUserEntityNoPasswordSchema>

/**
 * 系统用户分页项
 */
export const sysUserEntityNoRelationsNoPasswordSchema = sysUserEntityNoPasswordSchema.meta({ id: 'SysUserEntityNoRelationsNoPasswordDto' })

export type SysUserEntityNoRelationsNoPasswordDto = z.infer<typeof sysUserEntityNoRelationsNoPasswordSchema>
