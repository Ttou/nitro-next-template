import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltIgnore } from '@xlt-token/nestjs'
import { CaptchaService } from '~nestjs-modules/captcha'
import { captchaImageResSchema } from '~shared/dtos'

@ApiTags('验证码接口')
@Controller()
export class CaptchaController {
  constructor(
    private captchaService: CaptchaService,
  ) {}

  @ApiOperation({ summary: '图形验证码' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: captchaImageResSchema(),
  })
  @XltIgnore()
  @Get('image')
  async image() {
    return await this.captchaService.image()
  }
}
