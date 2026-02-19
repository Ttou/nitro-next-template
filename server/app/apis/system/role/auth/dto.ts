import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ArrayNotEmpty, IsNotEmpty, IsOptional } from 'class-validator'
import { SysUserEntity } from '~server/app/entities'
import { PageReqDto, PageResDto, ResultResDto } from '~server/app/openapi'

export class FindAllocatedUserPageForRoleReqDto extends PageReqDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @Transform(({ value }) => BigInt(value))
  id: bigint

  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  userName?: string

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  nickName?: string
}

export class FindUnallocatedUserPageForRoleReqDto extends FindAllocatedUserPageForRoleReqDto {}

export class AllocateUserForRoleReqDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @Transform(({ value }) => BigInt(value))
  id: bigint

  @ApiProperty({ description: '用户ID数组' })
  @ArrayNotEmpty({ message: 'ID数组不能为空' })
  @Transform(({ value }) => value.map(val => BigInt(val)))
  ids: Array<bigint>
}

export class UnallocateUserForRoleReqDto extends AllocateUserForRoleReqDto {}

export class FindAllocatedUserPageForRoleResDto extends ResultResDto(PageResDto(SysUserEntity)) {}

export class FindUnallocatedUserPageForRoleResDto extends FindAllocatedUserPageForRoleResDto {}
