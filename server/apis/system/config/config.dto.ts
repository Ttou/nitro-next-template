import type { SysConfigEntityDto } from '~db/dtos'
import type { IYesOrNoEnum } from '~shared/enums'
import { Transform } from 'class-transformer'
import { z } from 'zod'
import { sysConfigEntitySchema } from '~db/dtos'
import { ExcelColumn, ExcelFile } from '~nestjs-modules/excel'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { dateText, optionalEnumOf, optionalText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'

// 查询参数需要内联的 object schema 才能被展开成逐个 query 参数，因此不设 id
export const findSystemConfigByKeyReqSchema = z.object({
  configKey: requiredText('参数键名不能为空').describe('参数键名'),
})

export type FindSystemConfigByKeyReqDto = z.infer<typeof findSystemConfigByKeyReqSchema>

export const findSystemConfigPageReqSchema = pageReqSchema.extend({
  configName: optionalText().describe('参数名称'),
  configKey: optionalText().describe('参数标识'),
  isBuiltin: optionalEnumOf(YesOrNoEnumValues, '内置参数枚举值不正确').describe('是否内置参数'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  beginTime: dateText('开始时间格式不正确').nullish().transform(value => value ?? undefined).describe('开始时间'),
  endTime: dateText('结束时间格式不正确').nullish().transform(value => value ?? undefined).describe('结束时间'),
}).meta({ id: 'FindSystemConfigPageReqDto' })

export type FindSystemConfigPageReqDto = z.infer<typeof findSystemConfigPageReqSchema>

export const findSystemConfigPageResSchema = pageResSchema('FindSystemConfigPageResDto', sysConfigEntitySchema)

export type FindSystemConfigPageResDto = z.infer<typeof findSystemConfigPageResSchema>

export const createSystemConfigReqSchema = z.object({
  configName: requiredText('参数名称不能为空').describe('参数名称'),
  configKey: requiredText('参数标识不能为空').describe('参数标识'),
  configValue: requiredText('参数键值不能为空').describe('参数键值'),
  isBuiltin: optionalEnumOf(YesOrNoEnumValues, '内置参数枚举值不正确').describe('是否内置参数'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  remark: optionalText().describe('备注'),
}).meta({ id: 'CreateSystemConfigReqDto' })

export type CreateSystemConfigReqDto = z.infer<typeof createSystemConfigReqSchema>

export const updateSystemConfigReqSchema = createSystemConfigReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}).meta({ id: 'UpdateSystemConfigReqDto' })

export type UpdateSystemConfigReqDto = z.infer<typeof updateSystemConfigReqSchema>

@ExcelFile({
  fileName: '系统配置.xlsx',
})
export class ExportSystemConfigSerDto implements SysConfigEntityDto {
  @ExcelColumn({ header: 'ID' })
  id: string

  @ExcelColumn({ header: '参数名称' })
  configName: string

  @ExcelColumn({ header: '参数键值' })
  configKey: string

  @ExcelColumn({ header: '参数键值' })
  configValue: string

  @ExcelColumn({ header: '是否内置参数' })
  @Transform(({ value }) => YesOrNoEnum.label(value))
  isBuiltin: IYesOrNoEnum

  @ExcelColumn({ header: '是否可用' })
  @Transform(({ value }) => YesOrNoEnum.label(value))
  isAvailable: IYesOrNoEnum

  @ExcelColumn({ header: '备注' })
  remark: string

  @ExcelColumn({ header: '创建人' })
  createBy: string

  @ExcelColumn({ header: '创建时间' })
  createdAt: Date

  @ExcelColumn({ header: '更新人' })
  updateBy: string

  @ExcelColumn({ header: '更新时间' })
  updatedAt: Date

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}
