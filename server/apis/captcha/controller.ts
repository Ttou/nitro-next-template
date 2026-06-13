import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '~server/decorators'
import { ApiDoc } from '~server/openapi'
import { CaptchaService } from '~server/shared'
import { CaptchaImageResDto } from './dto'

@ApiTags('验证码接口')
@Controller()
export class CaptchaController {
  constructor(
    private captchaService: CaptchaService,
  ) {}

  @ApiDoc({ endpointSummary: '图形验证码', responseDto: CaptchaImageResDto })
  @Public()
  @Get('image')
  async image() {
    return await this.captchaService.image()
  }
}
