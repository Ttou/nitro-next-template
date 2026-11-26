import { z } from 'zod'
import { sysMenuEntityExcludeRelationSchema, sysRoleEntityExcludeRelationSchema, sysUserEntityNoPasswordSchema } from '~server/dtos'
import { emailText, optionalText, phoneText, requiredText } from '~server/dtos/zod'
import { defineSchema } from '~shared/utils'

/**
 * 更新当前用户密码请求体
 */
export const updateCurrentUserPasswordReqSchema = defineSchema(z.object({
  oldPassword: requiredText('旧密码不能为空').describe('旧密码'),
  newPassword: requiredText('新密码不能为空').describe('新密码'),
  confirmPassword: requiredText('确认密码不能为空').describe('确认密码'),
}).refine(dto => dto.confirmPassword === dto.newPassword, {
  error: '两次密码不一致',
  path: ['confirmPassword'],
}), { id: 'UpdateCurrentUserPasswordReqDto' })

export type UpdateCurrentUserPasswordReqDto = z.infer<typeof updateCurrentUserPasswordReqSchema>

/**
 * 更新当前用户个人信息请求体
 */
export const updateCurrentUserProfileReqSchema = defineSchema(z.object({
  nickName: optionalText().describe('昵称'),
  phone: phoneText().nullish().transform(value => value ?? undefined).describe('手机号码'),
  email: emailText().nullish().transform(value => value ?? undefined).describe('邮箱'),
  avatar: optionalText().describe('头像'),
}), { id: 'UpdateCurrentUserProfileReqDto' })

export type UpdateCurrentUserProfileReqDto = z.infer<typeof updateCurrentUserProfileReqSchema>

/**
 * 当前用户的角色（含菜单）
 */
const sysRoleEntityWithMenusRelationSchema = defineSchema(sysRoleEntityExcludeRelationSchema.extend({
  menus: z.array(sysMenuEntityExcludeRelationSchema).describe('菜单列表'),
}), { id: 'SysRoleEntityWithMenusRelation' })

/**
 * 当前用户信息响应传输对象
 */
export const currentUserGetInfoResSchema = defineSchema(sysUserEntityNoPasswordSchema.extend({
  roles: z.array(sysRoleEntityWithMenusRelationSchema).describe('角色列表'),
}), { id: 'CurrentUserGetInfoResDto' })

export type CurrentUserGetInfoResDto = z.infer<typeof currentUserGetInfoResSchema>

/**
 * 当前用户个人信息响应传输对象
 */
export const currentUserGetProfileResSchema = defineSchema(sysUserEntityNoPasswordSchema, { id: 'CurrentUserGetProfileResDto' })

export type CurrentUserGetProfileResDto = z.infer<typeof currentUserGetProfileResSchema>
