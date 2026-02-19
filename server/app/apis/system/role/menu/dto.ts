import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ArrayNotEmpty, IsNotEmpty } from 'class-validator'
import { ResultResDto } from '~server/app/openapi'

export class AssignMenuForRoleReqDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @Transform(({ value }) => BigInt(value))
  id: bigint

  @ApiProperty({ description: '菜单ID数组' })
  @ArrayNotEmpty({ message: 'ID数组不能为空' })
  @Transform(({ value }) => value.map(val => BigInt(val)))
  menuIds: Array<bigint>
}

export class FindAssignedMenuForRoleReqDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @Transform(({ value }) => BigInt(value))
  id: bigint
}

export class FindAssignedMenuForRoleResDto extends ResultResDto([String]) {}
