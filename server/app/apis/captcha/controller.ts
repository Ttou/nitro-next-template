import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CaptchaService } from './service'

@ApiTags('验证码接口')
@Controller()
export class CaptchaController {
  constructor(
    private readonly captchaService: CaptchaService,
  ) {}

  @ApiOperation({ summary: '图形验证码' })
  @Get('image')
  async image() {
    return await this.captchaService.image()
  }
}
