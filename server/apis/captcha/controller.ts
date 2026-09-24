import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { XltIgnore } from '@xlt-token/nestjs'
import { CaptchaService } from '~nestjs-modules/captcha'
import { ApiDoc } from '~server/openapi'
import { CaptchaImageResDto } from './dto'

@ApiTags('验证码接口')
@Controller()
export class CaptchaController {
  constructor(
    private captchaService: CaptchaService,
  ) {}

  @ApiDoc({ endpointSummary: '图形验证码', responseDto: CaptchaImageResDto })
  @XltIgnore()
  @Get('image')
  async image() {
    return await this.captchaService.image()
  }
}
