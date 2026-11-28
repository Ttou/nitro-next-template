import { z } from 'zod'
import { sysUserEntityNoRelationsNoPasswordSchema } from '~shared/dtos/for-db'
import { pageReqSchema, pageResSchema } from '~shared/dtos/page.dto'
import { emailText, optionalEnumOf, optionalText, phoneText, requiredText, uuid } from '~shared/dtos/zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, lazySchema } from '~shared/utils'

export const findSystemUserPageReqSchema = lazySchema(() => defineSchema(pageReqSchema().extend({
  userName: optionalText().describe('用户名'),
  nickName: optionalText().describe('昵称'),
  phone: phoneText().nullish().transform(value => value ?? undefined).describe('手机号码'),
  email: emailText().nullish().transform(value => value ?? undefined).describe('邮箱'),
  sex: optionalText().describe('性别'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
}), { id: 'FindSystemUserPageReqDto' }))

export type FindSystemUserPageReqDto = z.infer<ReturnType<typeof findSystemUserPageReqSchema>>

export const findSystemUserPageResSchema = lazySchema(() => pageResSchema('FindSystemUserPageResDto', sysUserEntityNoRelationsNoPasswordSchema()))

export type FindSystemUserPageResDto = z.infer<ReturnType<typeof findSystemUserPageResSchema>>

export const createSystemUserReqSchema = lazySchema(() => defineSchema(z.object({
  userName: requiredText('用户名不能为空').describe('用户名'),
  nickName: requiredText('昵称不能为空').describe('昵称'),
  password: requiredText('密码不能为空').min(6, { error: '密码不能少于6位' }).describe('密码'),
  sex: optionalText().describe('性别'),
  phone: phoneText().nullish().transform(value => value ?? undefined).describe('手机号码'),
  email: emailText().nullish().transform(value => value ?? undefined).describe('邮箱'),
  remark: optionalText().describe('备注'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
}), { id: 'CreateSystemUserReqDto' }))

export type CreateSystemUserReqDto = z.infer<ReturnType<typeof createSystemUserReqSchema>>

export const updateSystemUserReqSchema = lazySchema(() => defineSchema(createSystemUserReqSchema().extend({
  id: uuid('ID格式不正确').describe('ID'),
}), { id: 'UpdateSystemUserReqDto' }))

export type UpdateSystemUserReqDto = z.infer<ReturnType<typeof updateSystemUserReqSchema>>

/**
 * 导入系统用户响应传输对象
 */
export const importSystemUserResSchema = lazySchema(() => defineSchema(z.object({
  success: z.number().describe('成功数'),
  fail: z.number().describe('失败数'),
  items: z.array(z.string()).describe('导入失败的用户名列表'),
}), { id: 'ImportSystemUserResDto' }))

export type ImportSystemUserResDto = z.infer<ReturnType<typeof importSystemUserResSchema>>
