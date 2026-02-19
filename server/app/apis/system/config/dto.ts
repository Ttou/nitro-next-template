import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator'
import { SysConfigEntity } from '~server/app/entities'
import { PageReqDto, PageResDto, ResultResDto } from '~server/app/openapi'
import { IsEnumValues } from '~server/app/validators'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemConfigByKeyReqDto {
  @ApiProperty({ description: '参数键名' })
  @IsNotEmpty({ message: '参数键名不能为空' })
  configKey: string
}

export class FindSystemConfigPageReqDto extends PageReqDto {
  @ApiProperty({ description: '参数名称' })
  @IsOptional()
  configName?: string

  @ApiProperty({ description: '参数标识' })
  @IsOptional()
  configKey?: string

  @ApiPropertyOptional({ description: '是否内置参数', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '内置参数枚举值不正确' })
  isBuiltin?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
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

export class CreateSystemConfigReqDto {
  @ApiProperty({ description: '参数名称' })
  @IsNotEmpty({ message: '参数名称不能为空' })
  configName: string

  @ApiProperty({ description: '参数标识' })
  @IsNotEmpty({ message: '参数标识不能为空' })
  configKey: string

  @ApiProperty({ description: '参数键值' })
  @IsNotEmpty({ message: '参数键值不能为空' })
  configValue: string

  @ApiPropertyOptional({ description: '是否内置参数', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '内置参数枚举值不正确' })
  isBuiltin?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemConfigReqDto extends CreateSystemConfigReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @Transform(({ value }) => BigInt(value))
  id: bigint
}

export class FindSystemConfigByKeyResDto extends ResultResDto(SysConfigEntity) {}

class FindSystemConfigPageData extends PageResDto(SysConfigEntity) {}

export class FindSystemConfigPageResDto extends ResultResDto(FindSystemConfigPageData) {}
