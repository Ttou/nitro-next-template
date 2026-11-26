import { z } from 'zod'
import { defineExcel } from '~nestjs-modules/excel'
import { pageReqSchema, pageResSchema, sysUserEntityNoRelationsNoPasswordSchema } from '~server/dtos'
import { emailText, optionalEnumOf, optionalText, phoneText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, enumLabelField } from '~shared/utils'

export const findSystemUserPageReqSchema = defineSchema(pageReqSchema.extend({
  userName: optionalText().describe('用户名'),
  nickName: optionalText().describe('昵称'),
  phone: phoneText().nullish().transform(value => value ?? undefined).describe('手机号码'),
  email: emailText().nullish().transform(value => value ?? undefined).describe('邮箱'),
  sex: optionalText().describe('性别'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
}), { id: 'FindSystemUserPageReqDto' })

export type FindSystemUserPageReqDto = z.infer<typeof findSystemUserPageReqSchema>

export const findSystemUserPageResSchema = pageResSchema('FindSystemUserPageResDto', sysUserEntityNoRelationsNoPasswordSchema)

export type FindSystemUserPageResDto = z.infer<typeof findSystemUserPageResSchema>

export const createSystemUserReqSchema = defineSchema(z.object({
  userName: requiredText('用户名不能为空').describe('用户名'),
  nickName: requiredText('昵称不能为空').describe('昵称'),
  password: requiredText('密码不能为空').min(6, { error: '密码不能少于6位' }).describe('密码'),
  sex: optionalText().describe('性别'),
  phone: phoneText().nullish().transform(value => value ?? undefined).describe('手机号码'),
  email: emailText().nullish().transform(value => value ?? undefined).describe('邮箱'),
  remark: optionalText().describe('备注'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
}), { id: 'CreateSystemUserReqDto' })

export type CreateSystemUserReqDto = z.infer<typeof createSystemUserReqSchema>

export const updateSystemUserReqSchema = defineSchema(createSystemUserReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}), { id: 'UpdateSystemUserReqDto' })

export type UpdateSystemUserReqDto = z.infer<typeof updateSystemUserReqSchema>

export const exportSystemUserExcel = defineExcel({
  fileName: '系统用户.xlsx',
  schema: z.object({
    id: z.string().describe('ID'),
    userName: z.string().describe('账号'),
    nickName: z.string().describe('昵称'),
    phone: z.string().describe('手机号码'),
    email: z.string().describe('邮箱'),
    sex: z.string().describe('性别'),
    isAvailable: enumLabelField(YesOrNoEnum).describe('是否可用'),
    remark: z.string().describe('备注'),
    isDelete: enumLabelField(YesOrNoEnum).describe('是否删除'),
    avatar: z.string().describe('头像'),
    createBy: z.string().describe('创建人'),
    createdAt: z.date().describe('创建时间'),
    updateBy: z.string().describe('更新人'),
    updatedAt: z.date().describe('更新时间'),
  }),
})

/**
 * 系统用户导入列
 *
 * 只声明模板里出现的列，导入时按这份 schema 的顺序逐列取值
 */
export const importSystemUserSchema = z.object({
  userName: z.string().describe('账号'),
  nickName: z.string().describe('昵称'),
  phone: z.string().describe('手机号码'),
  email: z.string().describe('邮箱'),
  sex: z.string().describe('性别'),
  remark: z.string().describe('备注'),
})

export type ImportSystemUserSerDto = z.infer<typeof importSystemUserSchema>

export const importSystemUserExcel = defineExcel({
  fileName: '系统用户导入模板.xlsx',
  sheetName: '系统用户',
  schema: importSystemUserSchema,
})

/**
 * 导入系统用户响应传输对象
 */
export const importSystemUserResSchema = defineSchema(z.object({
  success: z.number().describe('成功数'),
  fail: z.number().describe('失败数'),
  items: z.array(z.string()).describe('导入失败的用户名列表'),
}), { id: 'ImportSystemUserResDto' })

export type ImportSystemUserResDto = z.infer<typeof importSystemUserResSchema>
