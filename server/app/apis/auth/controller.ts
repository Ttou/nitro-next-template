import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Public } from '~server/app/decorators'
import { AutoOperation } from '~server/app/extends'
import { LoginReqDto, LoginResDto } from './dto'
import { AuthService } from './service'

@ApiTags('鉴权接口')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @AutoOperation({ summary: '登录' })
  @ApiOkResponse({ schema: LoginResDto })
  @Public()
  @Post('login')
  async login(@Body() dto: LoginReqDto) {
    return await this.authService.login(dto)
  }

  @ApiBearerAuth()
  @AutoOperation({ summary: '退出' })
  @Post('logout')
  async logout() {
    return await this.authService.logout()
  }
}
