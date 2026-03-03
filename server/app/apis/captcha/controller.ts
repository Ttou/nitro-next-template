import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '~server/app/decorators'
import { AutoOperation, AutoResponse, CaptchaService } from '~server/app/extends'
import { CaptchaImageResDto } from './dto'

@ApiTags('验证码接口')
@Controller()
export class CaptchaController {
  constructor(
    private captchaService: CaptchaService,
  ) {}

  @AutoOperation({ summary: '图形验证码' })
  @AutoResponse({ type: CaptchaImageResDto })
  @Public()
  @Get('image')
  async image() {
    return await this.captchaService.image()
  }
}
