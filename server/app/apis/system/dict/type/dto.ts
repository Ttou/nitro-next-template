import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Transform } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator'
import { SysDictDataEntity, SysDictTypeEntity } from '~server/app/entities'
import { PageReqDto, PageResDto, ResultResDto } from '~server/app/openapi'
import { IsEnumValues } from '~server/app/validators'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemDictTypePageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '字典名称' })
  @IsOptional()
  dictName?: string

  @ApiPropertyOptional({ description: '字典类型' })
  @IsOptional()
  dictType?: string

  @ApiPropertyOptional({ description: '可用状态', enum: YesOrNoEnumMap })
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

export class CreateSystemDictTypeDto {
  @ApiPropertyOptional({ description: '字典名称' })
  @IsNotEmpty({ message: '字典名称不能为空' })
  dictName: string

  @ApiPropertyOptional({ description: '字典类型' })
  @IsNotEmpty({ message: '字典类型不能为空' })
  dictType: string

  @ApiPropertyOptional({ description: '可用状态', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemDictTypeReqDto extends CreateSystemDictTypeDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @Transform(({ value }) => BigInt(value))
  id: bigint
}

export class FindSystemDictDetailByKeyReqDto {
  @ApiProperty({ description: '字典类型' })
  @IsNotEmpty({ message: '字典类型不能为空' })
  dictType: string
}

export class FindSystemDictDetailByKeyResDto extends ResultResDto([SysDictDataEntity]) {}

class FindSystemDictTypePageData extends PageResDto(SysDictTypeEntity) {}

export class FindSystemDictTypePageResDto extends ResultResDto(FindSystemDictTypePageData) {}
