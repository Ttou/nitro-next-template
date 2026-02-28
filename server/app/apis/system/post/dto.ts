import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysPostEntity } from '~server/app/entities'
import { PageReqDto, PageResDto } from '~server/app/extends'
import { IsEnumValues } from '~server/app/validators'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemPostPageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '岗位标识' })
  @IsOptional()
  postKey?: string

  @ApiPropertyOptional({ description: '岗位名称' })
  @IsOptional()
  postName?: string

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

export class CreateSystemPostReqDto {
  @ApiProperty({ description: '岗位名称' })
  @IsNotEmpty({ message: '岗位名称不能为空' })
  postName: string

  @ApiProperty({ description: '岗位标识' })
  @IsNotEmpty({ message: '岗位标识不能为空' })
  postKey: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemPostReqDto extends CreateSystemPostReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export class FindSystemPostPageResDto extends PageResDto(SysPostEntity) {}
