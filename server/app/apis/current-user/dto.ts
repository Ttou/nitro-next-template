import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator'
import { SysUserEntity } from '~server/app/entities'
import { ResultResDto } from '~server/app/openapi'
import { IsEqual } from '~server/app/validators'

/**
 * 更新当前用户密码请求体
 */
export class UpdateCurrentUserPasswordReqDto {
  @ApiProperty({ description: '旧密码', example: '' })
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword: string

  @ApiProperty({ description: '新密码', example: '' })
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string

  @ApiProperty({ description: '确认密码', example: '' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  @IsEqual('newPassword', { message: '两次密码不一致' })
  confirmPassword: string
}

/**
 * 更新当前用户个人信息请求体
 */
export class UpdateCurrentUserProfileReqDto {
  @ApiPropertyOptional({ description: '昵称', example: '' })
  @IsOptional()
  nickname?: string

  @ApiPropertyOptional({ description: '手机号码', example: '' })
  @IsOptional()
  @IsPhoneNumber('CN', { message: '手机号码格式不正确' })
  phone?: string

  @ApiPropertyOptional({ description: '邮箱', example: '' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string

  @ApiPropertyOptional({ description: '头像', example: '' })
  @IsOptional()
  avatar?: string
}

export class SystemUserGetInfoResDto extends ResultResDto(OmitType(SysUserEntity, ['password'])) {}

export class SystemUserGetProfileResDto extends SystemUserGetInfoResDto {}
