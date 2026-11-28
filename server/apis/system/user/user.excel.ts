import { z } from 'zod'
import { defineExcel } from '~nestjs-modules/excel'
import { YesOrNoEnum } from '~shared/enums'
import { enumLabelField, lazySchema } from '~shared/utils'

/**
 * 系统用户导出表
 */
export const exportSystemUserExcel = lazySchema(() => defineExcel({
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
}))

/**
 * 系统用户导入列
 *
 * 只声明模板里出现的列，导入时按这份 schema 的顺序逐列取值
 */
export const importSystemUserSchema = lazySchema(() => z.object({
  userName: z.string().describe('账号'),
  nickName: z.string().describe('昵称'),
  phone: z.string().describe('手机号码'),
  email: z.string().describe('邮箱'),
  sex: z.string().describe('性别'),
  remark: z.string().describe('备注'),
}))

export type ImportSystemUserSerDto = z.infer<ReturnType<typeof importSystemUserSchema>>

/**
 * 系统用户导入模板
 */
export const importSystemUserExcel = lazySchema(() => defineExcel({
  fileName: '系统用户导入模板.xlsx',
  sheetName: '系统用户',
  schema: importSystemUserSchema(),
}))
