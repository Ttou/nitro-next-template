import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Public } from '~server/app/decorators'
import { AutoOperation } from '~server/app/extends'
import { CaptchaService } from '~server/app/services'
import { CaptchaImageResDto } from './dto'

@ApiTags('验证码接口')
@Controller()
export class CaptchaController {
  constructor(
    private readonly captchaService: CaptchaService,
  ) {}

  @AutoOperation({ summary: '图形验证码' })
  @ApiOkResponse({ type: CaptchaImageResDto })
  @Public()
  @Get('image')
  async image() {
    return await this.captchaService.image()
  }
}
