import type { ILangEnum, IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { ExcelColumn, ExcelFile } from '~nestjs-modules/excel'
import { PageReqDto } from '~server/dtos'
import { IsEnumValues } from '~server/validators'
import { LangEnumMap, LangEnumValues, YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemLangPageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '词条标识' })
  @IsOptional()
  langKey?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string

  @ApiPropertyOptional({ description: '是否内置', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '是否内置枚举值不正确' })
  isBuiltin?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '是否可用枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsDateString({}, { message: '开始时间格式不正确' })
  beginTime?: string

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsDateString({}, { message: '结束时间格式不正确' })
  endTime?: string
}

export class FindSystemLangAllReqDto {
  @ApiProperty({ description: '词条编码', enum: LangEnumMap })
  @IsNotEmpty({ message: '词条编码不能为空' })
  @IsEnumValues(LangEnumValues, { message: '词条编码枚举值不正确' })
  langCode: string
}

export class FindSystemLangOneReqDto {
  @ApiProperty({ description: '词条标识' })
  @IsNotEmpty({ message: '词条标识不能为空' })
  langKey: string
}

export class CreateSystemLangReqDto {
  @ApiProperty({ description: '词条标识' })
  @IsNotEmpty({ message: '词条标识不能为空' })
  langKey: string

  @ApiProperty({ description: '词条值' })
  @IsNotEmpty({ message: '词条值不能为空' })
  langValue: Record<ILangEnum, string>

  @ApiProperty({ description: '是否内置', enum: YesOrNoEnumMap })
  @IsNotEmpty({ message: '是否内置不能为空' })
  @IsEnumValues(YesOrNoEnumValues, { message: '是否内置枚举值不正确' })
  isBuiltin: IYesOrNoEnum

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsNotEmpty({ message: '是否可用不能为空' })
  @IsEnumValues(YesOrNoEnumValues, { message: '是否可用枚举值不正确' })
  isAvailable: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemLangReqDto extends CreateSystemLangReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export class TranslateSystemLangReqDto {
  @ApiProperty({ description: '词条文本' })
  @IsNotEmpty({ message: '词条文本不能为空' })
  text: string
}

@ExcelFile({
  fileName: '系统语言导入模板.xlsx',
  sheetName: '系统语言',
})
export class ImportSystemLangSerDto {
  @ExcelColumn({ header: '词条标识' })
  langKey: string

  // 语言列与 LangEnum 保持一致，新增语言时在此补充对应列
  @ExcelColumn({ header: '简体中文(zh_CN)' })
  zh_CN: string

  @ExcelColumn({ header: 'English(en_US)' })
  en_US: string

  @ExcelColumn({ header: '备注' })
  remark?: string

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}

export class ImportSystemLangResDto {
  @ApiProperty({ description: '成功数' })
  success: number

  @ApiProperty({ description: '失败数' })
  fail: number

  @ApiProperty({ description: '导入失败的词条标识列表' })
  items: string[]
}
