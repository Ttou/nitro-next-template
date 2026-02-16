import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '~server/app/decorators'
import { LoginReqDTO, LoginResDTO } from './dto'
import { AuthService } from './service'

@ApiTags('鉴权接口')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '登录' })
  @ApiOkResponse({ type: LoginResDTO })
  @Public()
  @Post('login')
  async login(@Body() data: LoginReqDTO) {
    return await this.authService.login(data)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '退出' })
  @Post('logout')
  async logout() {
    // return this.authService.logout()
  }
}
