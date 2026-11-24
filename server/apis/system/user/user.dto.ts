import type { SysUserEntityNoRelationsNoPasswordDto } from '~db/dtos'
import type { IYesOrNoEnum } from '~shared/enums'
import { Transform } from 'class-transformer'
import { z } from 'zod'
import { sysUserEntityNoRelationsNoPasswordSchema } from '~db/dtos'
import { ExcelColumn, ExcelFile } from '~nestjs-modules/excel'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { emailText, optionalEnumOf, optionalText, phoneText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'

export const findSystemUserPageReqSchema = pageReqSchema.extend({
  userName: optionalText().describe('用户名'),
  nickName: optionalText().describe('昵称'),
  phone: phoneText().nullish().transform(value => value ?? undefined).describe('手机号码'),
  email: emailText().nullish().transform(value => value ?? undefined).describe('邮箱'),
  sex: optionalText().describe('性别'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
}).meta({ id: 'FindSystemUserPageReqDto' })

export type FindSystemUserPageReqDto = z.infer<typeof findSystemUserPageReqSchema>

export const findSystemUserPageResSchema = pageResSchema('FindSystemUserPageResDto', sysUserEntityNoRelationsNoPasswordSchema)

export type FindSystemUserPageResDto = z.infer<typeof findSystemUserPageResSchema>

export const createSystemUserReqSchema = z.object({
  userName: requiredText('用户名不能为空').describe('用户名'),
  nickName: requiredText('昵称不能为空').describe('昵称'),
  password: requiredText('密码不能为空').min(6, { error: '密码不能少于6位' }).describe('密码'),
  sex: optionalText().describe('性别'),
  phone: phoneText().nullish().transform(value => value ?? undefined).describe('手机号码'),
  email: emailText().nullish().transform(value => value ?? undefined).describe('邮箱'),
  remark: optionalText().describe('备注'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
}).meta({ id: 'CreateSystemUserReqDto' })

export type CreateSystemUserReqDto = z.infer<typeof createSystemUserReqSchema>

export const updateSystemUserReqSchema = createSystemUserReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}).meta({ id: 'UpdateSystemUserReqDto' })

export type UpdateSystemUserReqDto = z.infer<typeof updateSystemUserReqSchema>

@ExcelFile({
  fileName: '系统用户.xlsx',
})
export class ExportSystemUserSerDto implements SysUserEntityNoRelationsNoPasswordDto {
  @ExcelColumn({ header: 'ID' })
  id: string

  @ExcelColumn({ header: '账号' })
  userName: string

  @ExcelColumn({ header: '昵称' })
  nickName: string

  @ExcelColumn({ header: '手机号码' })
  phone?: INullable<string>

  @ExcelColumn({ header: '邮箱' })
  email?: INullable<string>

  @ExcelColumn({ header: '性别' })
  sex?: INullable<string>

  @ExcelColumn({ header: '是否可用' })
  @Transform(({ value }) => YesOrNoEnum.label(value))
  isAvailable: IYesOrNoEnum

  @ExcelColumn({ header: '备注' })
  remark?: INullable<string>

  @ExcelColumn({ header: '是否删除' })
  @Transform(({ value }) => YesOrNoEnum.label(value))
  isDelete: IYesOrNoEnum

  @ExcelColumn({ header: '头像' })
  avatar?: INullable<string>

  @ExcelColumn({ header: '创建人' })
  createBy?: INullable<string>

  @ExcelColumn({ header: '创建时间' })
  createdAt: Date

  @ExcelColumn({ header: '更新人' })
  updateBy?: INullable<string>

  @ExcelColumn({ header: '更新时间' })
  updatedAt: Date

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}

@ExcelFile({
  fileName: '系统用户导入模板.xlsx',
  sheetName: '系统用户',
})
export class ImportSystemUserSerDto implements SysUserEntityNoRelationsNoPasswordDto {
  id: string

  @ExcelColumn({ header: '账号' })
  userName: string

  @ExcelColumn({ header: '昵称' })
  nickName: string

  @ExcelColumn({ header: '手机号码' })
  phone?: INullable<string>

  @ExcelColumn({ header: '邮箱' })
  email?: INullable<string>

  @ExcelColumn({ header: '性别' })
  sex?: INullable<string>

  isAvailable: IYesOrNoEnum

  @ExcelColumn({ header: '备注' })
  remark?: INullable<string>

  isDelete: IYesOrNoEnum

  avatar?: INullable<string>

  createBy?: INullable<string>

  createdAt: Date

  updateBy?: INullable<string>

  updatedAt: Date

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}

/**
 * 导入系统用户响应传输对象
 */
export const importSystemUserResSchema = z.object({
  success: z.number().describe('成功数'),
  fail: z.number().describe('失败数'),
  items: z.array(z.string()).describe('导入失败的用户名列表'),
}).meta({ id: 'ImportSystemUserResDto' })

export type ImportSystemUserResDto = z.infer<typeof importSystemUserResSchema>
