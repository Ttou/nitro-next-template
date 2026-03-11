import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '~server/decorators'
import { LoginReqDto } from './dto'
import { AuthService } from './service'

@ApiTags('鉴权接口')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: '登录' })
  @ApiOkResponse({ type: String })
  @Public()
  @Post('login')
  async login(@Body() dto: LoginReqDto) {
    return await this.authService.login(dto)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '退出' })
  @Post('logout')
  async logout() {
    return await this.authService.logout()
  }
}
