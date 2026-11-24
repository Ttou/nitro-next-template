import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltIgnore } from '@xlt-token/nestjs'
import { LoginLogInterceptor } from '~server/interceptors'
import { AuthPublicKeyResDto, LoginReqDto } from './auth.dto'
import { AuthService } from './auth.service'

@ApiTags('鉴权接口')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: '登录' })
  @ApiOkResponse({ description: '请求成功', type: String })
  @XltIgnore()
  @UseInterceptors(LoginLogInterceptor)
  @Post('login')
  async login(@Body() dto: LoginReqDto) {
    return await this.authService.login(dto)
  }

  @ApiOperation({ summary: '获取登录公钥' })
  @ApiOkResponse({ description: '请求成功', type: AuthPublicKeyResDto })
  @XltIgnore()
  @Get('public-key')
  getPublicKey() {
    return this.authService.getPublicKey()
  }

  @ApiOperation({ summary: '退出' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiBearerAuth()
  @Post('logout')
  async logout() {
    return await this.authService.logout()
  }
}
