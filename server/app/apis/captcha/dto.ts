import { ApiProperty } from '@nestjs/swagger'
import { ResultResDto } from '~server/app/openapi'

export class CaptchaImageData {
  @ApiProperty({ description: '验证码ID', example: '' })
  captchaId: string

  @ApiProperty({ description: '验证码图片', example: '' })
  captchaImage: string
}

export class CaptchaImageResDto extends ResultResDto(CaptchaImageData) {}
