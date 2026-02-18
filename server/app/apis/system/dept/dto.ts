import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { SysDeptEntity } from '~server/app/entities'
import { ResultResDto } from '~server/app/openapi'
import { IsEnumValues } from '~server/app/validators'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemDeptListReqDto {
  @ApiPropertyOptional({ description: '部门名称' })
  @IsOptional()
  deptName?: string

  @ApiPropertyOptional({ description: '部门标识' })
  @IsOptional()
  deptKey?: string

  @ApiPropertyOptional({ description: '可用状态', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum
}

export class CreateSystemDeptReqDto {
  @ApiPropertyOptional({ description: '父部门ID' })
  @IsOptional()
  @Transform(({ value }) => value ? BigInt(value) : null)
  parentId?: bigint

  @ApiPropertyOptional({ description: '部门名称' })
  @IsNotEmpty({ message: '部门名称不能为空' })
  deptName: string

  @ApiPropertyOptional({ description: '部门标识' })
  @IsNotEmpty({ message: '部门标识不能为空' })
  deptKey: string

  @ApiPropertyOptional({ description: '可用状态', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemDeptReqDto extends CreateSystemDeptReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @Transform(({ value }) => BigInt(value))
  id: bigint
}

export class FindSystemDeptListResDto extends ResultResDto([SysDeptEntity]) {}
