import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysDictDataEntity } from '~server/app/entities'
import { PageResDto } from '~server/app/extends'
import { IsEnumValues } from '~server/app/validators'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemDictDataListReqDto {
  @ApiProperty({ description: '字典类型' })
  @IsNotEmpty({ message: '字典类型不能为空' })
  dictType: string

  @ApiPropertyOptional({ description: '字典标签' })
  @IsOptional()
  dictLabel?: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum
}

export class CreateSystemDictDataReqDto {
  @ApiProperty({ description: '字典标签' })
  @IsNotEmpty({ message: '字典标签不能为空' })
  dictLabel: string

  @ApiProperty({ description: '字典值' })
  @IsNotEmpty({ message: '字典值不能为空' })
  dictValue: string

  @ApiProperty({ description: '字典类型' })
  @IsNotEmpty({ message: '字典类型不能为空' })
  dictType: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemDictDataReqDto extends CreateSystemDictDataReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export class FindSystemDictDataListResDto extends PageResDto(SysDictDataEntity) {}
