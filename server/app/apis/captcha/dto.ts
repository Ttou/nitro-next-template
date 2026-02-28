import { ApiProperty } from '@nestjs/swagger'

export class CaptchaImageResDto {
  @ApiProperty({ description: '验证码ID', example: '' })
  captchaId: string

  @ApiProperty({ description: '验证码图片', example: '' })
  captchaImage: string
}
