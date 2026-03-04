import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysRoleEntityNoRelations, SysUserEntityNoRelations } from '~server/app/entities'
import { PageReqDto, PageResDto } from '~server/app/extends'

export class FindAllocatedUserPageForRoleReqDto extends PageReqDto {
  @ApiProperty({ description: '角色ID' })
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

export class FindUnallocatedUserPageForRoleReqDto extends FindAllocatedUserPageForRoleReqDto {}

export class AllocateUserForRoleReqDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string

  @ApiProperty({ description: '用户ID数组' })
  @ArrayNotEmpty({ message: 'ID数组不能为空' })
  @IsUUID('7', { each: true, message: 'ID格式不正确' })
  ids: Array<string>
}

class SysUserEntityWithRoles extends SysUserEntityNoRelations {
  @ApiProperty({ description: '角色列表', type: () => [SysRoleEntityNoRelations] })
  roles: SysRoleEntityNoRelations[]
}

export class UnallocateUserForRoleReqDto extends AllocateUserForRoleReqDto {}

export class FindAllocatedUserPageForRoleResDto extends PageResDto(SysUserEntityWithRoles) {}

export class FindUnallocatedUserPageForRoleResDto extends FindAllocatedUserPageForRoleResDto {}
