import type { SysDictDataEntityDto } from '~db/dtos'
import type { IYesOrNoEnum } from '~shared/enums'
import { Transform } from 'class-transformer'
import { z } from 'zod'
import { ExcelColumn, ExcelFile } from '~nestjs-modules/excel'
import { optionalEnumOf, optionalText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'

export const findSystemDictDataListReqSchema = z.object({
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
  dictLabel: optionalText().describe('字典标签'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
}).meta({ id: 'FindSystemDictDataListReqDto' })

export type FindSystemDictDataListReqDto = z.infer<typeof findSystemDictDataListReqSchema>

export const createSystemDictDataReqSchema = z.object({
  dictLabel: requiredText('字典标签不能为空').describe('字典标签'),
  dictValue: requiredText('字典值不能为空').describe('字典值'),
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  remark: optionalText().describe('备注'),
}).meta({ id: 'CreateSystemDictDataReqDto' })

export type CreateSystemDictDataReqDto = z.infer<typeof createSystemDictDataReqSchema>

export const updateSystemDictDataReqSchema = createSystemDictDataReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}).meta({ id: 'UpdateSystemDictDataReqDto' })

export type UpdateSystemDictDataReqDto = z.infer<typeof updateSystemDictDataReqSchema>

@ExcelFile({
  fileName: '系统字典数据.xlsx',
})
export class ExportSystemDictDataSerDto implements SysDictDataEntityDto {
  @ExcelColumn({ header: 'ID' })
  id: string

  @ExcelColumn({ header: '字典标签' })
  dictLabel: string

  @ExcelColumn({ header: '字典值' })
  dictValue: string

  @ExcelColumn({ header: '字典类型' })
  dictType: string

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
