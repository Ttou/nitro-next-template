import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

/**
 * 登录请求传输对象
 */
export class LoginReqDto {
  /**
   * 账号
   */
  @ApiProperty({ description: '账号', example: '' })
  @IsNotEmpty({ message: '账号不能为空' })
  userName: string

  /**
   * 密码
   */
  @ApiProperty({ description: '密码（RSA-OAEP 加密后的 Base64 密文）', example: '' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string

  /**
   * 验证码编号
   */
  @ApiProperty({ description: '验证码编号', example: '' })
  @IsNotEmpty({ message: '验证码编号不能为空' })
  captchaId: string

  /**
   * 验证码值
   */
  @ApiProperty({ description: '验证码值', example: '' })
  @IsNotEmpty({ message: '验证码值不能为空' })
  captchaValue: string
}

/**
 * 登录公钥响应传输对象
 */
export class AuthPublicKeyResDto {
  /**
   * 加密算法
   */
  @ApiProperty({ description: '加密算法', example: 'RSA-OAEP-256' })
  algorithm: string

  /**
   * 公钥（SPKI DER 的 Base64）
   */
  @ApiProperty({ description: '公钥（SPKI DER 的 Base64）', example: '' })
  publicKey: string
}
