import type { ISchema } from '~server/app/extends'
import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysLangEntity } from '~server/app/entities'
import { PageReqDto, PageResDto } from '~server/app/extends'
import { IsEnumValues } from '~server/app/validators'
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
  langValue: string

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

export const FindSystemLangAllResDto: ISchema = {
  type: 'object',
}

export const FindSystemLangOneResDto: ISchema = {
  type: 'array',
  items: {
    $ref: getSchemaPath(SysLangEntity),
  },
}

export class FindSystemLangPageResDto extends PageResDto(SysLangEntity) {}
