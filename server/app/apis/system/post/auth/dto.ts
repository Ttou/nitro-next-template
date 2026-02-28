import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysUserEntity } from '~server/app/entities'
import { PageReqDto, PageResDto } from '~server/app/extends'

export class FindAllocatedUserPageForPostReqDto extends PageReqDto {
  @ApiProperty({ description: '岗位ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string

  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  userName?: string

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  nickName?: string
}

export class FindUnallocatedUserPageForPostReqDto extends FindAllocatedUserPageForPostReqDto {}

export class AllocateUserForPostReqDto {
  @ApiProperty({ description: '岗位ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string

  @ApiProperty({ description: '用户ID数组' })
  @ArrayNotEmpty({ message: 'ID数组不能为空' })
  @IsUUID('7', { each: true, message: 'ID格式不正确' })
  ids: Array<string>
}

export class UnallocateUserForPostReqDto extends AllocateUserForPostReqDto {}

export class FindAllocatedUserPageForPostResDto extends PageResDto(SysUserEntity) {}

export class FindUnallocatedUserPageForPostResDto extends FindAllocatedUserPageForPostResDto {}
