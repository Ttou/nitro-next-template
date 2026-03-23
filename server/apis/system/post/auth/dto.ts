import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysPostEntityNoRelations, SysUserEntityNoRelations } from '~server/database'
import { PageReqDto, PageResDto } from '~server/extends'

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

class SysUserEntityWithPosts extends SysUserEntityNoRelations {
  @ApiProperty({ description: '岗位列表', type: () => [SysPostEntityNoRelations] })
  posts: SysPostEntityNoRelations[]
}

export class FindAllocatedUserPageForPostResDto extends PageResDto(SysUserEntityWithPosts) {}

export class FindUnallocatedUserPageForPostResDto extends FindAllocatedUserPageForPostResDto {}
