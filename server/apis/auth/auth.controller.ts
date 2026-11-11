import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltIgnore } from '@xlt-token/nestjs'
import { LoginLogInterceptor } from '~server/interceptors'
import { ApiDoc } from '~server/decorators'
import { AuthPublicKeyResDto, LoginReqDto } from './auth.dto'
import { AuthService } from './auth.service'

@ApiTags('鉴权接口')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @ApiDoc({ endpointSummary: '登录', responseDto: String })
  @XltIgnore()
  @UseInterceptors(LoginLogInterceptor)
  @Post('login')
  async login(@Body() dto: LoginReqDto) {
    return await this.authService.login(dto)
  }

  @ApiDoc({ endpointSummary: '获取登录公钥', responseDto: AuthPublicKeyResDto })
  @XltIgnore()
  @Get('public-key')
  getPublicKey() {
    return this.authService.getPublicKey()
  }

  @ApiBearerAuth()
  @ApiDoc({ endpointSummary: '退出' })
  @Post('logout')
  async logout() {
    return await this.authService.logout()
  }
}
