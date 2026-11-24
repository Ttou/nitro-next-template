import type { SysDictTypeEntityDto } from '~db/dtos'
import type { IYesOrNoEnum } from '~shared/enums'
import { Transform } from 'class-transformer'
import { z } from 'zod'
import { sysDictDataEntitySchema, sysDictTypeEntitySchema } from '~db/dtos'
import { ExcelColumn, ExcelFile } from '~nestjs-modules/excel'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { dateText, optionalEnumOf, optionalText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'

export const findSystemDictTypePageReqSchema = pageReqSchema.extend({
  dictName: optionalText().describe('字典名称'),
  dictType: optionalText().describe('字典类型'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('可用状态'),
  beginTime: dateText('开始时间格式不正确').nullish().transform(value => value ?? undefined).describe('开始时间'),
  endTime: dateText('结束时间格式不正确').nullish().transform(value => value ?? undefined).describe('结束时间'),
}).meta({ id: 'FindSystemDictTypePageReqDto' })

export type FindSystemDictTypePageReqDto = z.infer<typeof findSystemDictTypePageReqSchema>

export const findSystemDictTypePageResSchema = pageResSchema('FindSystemDictTypePageResDto', sysDictTypeEntitySchema)

export type FindSystemDictTypePageResDto = z.infer<typeof findSystemDictTypePageResSchema>

export const createSystemDictTypeReqSchema = z.object({
  dictName: requiredText('字典名称不能为空').describe('字典名称'),
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('可用状态'),
  remark: optionalText().describe('备注'),
}).meta({ id: 'CreateSystemDictTypeReqDto' })

export type CreateSystemDictTypeReqDto = z.infer<typeof createSystemDictTypeReqSchema>

export const updateSystemDictTypeReqSchema = createSystemDictTypeReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}).meta({ id: 'UpdateSystemDictTypeReqDto' })

export type UpdateSystemDictTypeReqDto = z.infer<typeof updateSystemDictTypeReqSchema>

// 查询参数需要内联的 object schema 才能被展开成逐个 query 参数，因此不设 id
export const findSystemDictDetailByKeyReqSchema = z.object({
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
})

export type FindSystemDictDetailByKeyReqDto = z.infer<typeof findSystemDictDetailByKeyReqSchema>

export const findSystemDictDetailByKeyResSchema = sysDictDataEntitySchema.meta({ id: 'FindSystemDictDetailByKeyResDto' })

export type FindSystemDictDetailByKeyResDto = z.infer<typeof findSystemDictDetailByKeyResSchema>

@ExcelFile({
  fileName: '系统字典类型.xlsx',
})
export class ExportSystemDictTypeSerDto implements SysDictTypeEntityDto {
  @ExcelColumn({ header: 'ID' })
  id: string

  @ExcelColumn({ header: '字典名称' })
  dictName: string

  @ExcelColumn({ header: '字典类型' })
  dictType: string

  @ExcelColumn({ header: '可用状态' })
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
