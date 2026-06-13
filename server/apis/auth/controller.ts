import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Public } from '~server/decorators'
import { ApiDoc } from '~server/openapi'
import { LoginReqDto } from './dto'
import { AuthService } from './service'

@ApiTags('鉴权接口')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @ApiDoc({ endpointSummary: '登录', responseDto: String })
  @Public()
  @Post('login')
  async login(@Body() dto: LoginReqDto) {
    return await this.authService.login(dto)
  }

  @ApiBearerAuth()
  @ApiDoc({ endpointSummary: '退出' })
  @Post('logout')
  async logout() {
    return await this.authService.logout()
  }
}
