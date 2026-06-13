import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Operate } from '~server/decorators'
import { ApiDoc } from '~server/openapi'
import { CurrentUserGetInfoResDto, CurrentUserGetProfileResDto, UpdateCurrentUserPasswordReqDto, UpdateCurrentUserProfileReqDto } from './dto'
import { CurrentUserService } from './service'

@ApiTags('当前用户接口')
@ApiBearerAuth()
@Controller()
export class CurrentUserController {
  constructor(
    private currentUserService: CurrentUserService,
  ) {}

  @ApiDoc({ endpointSummary: '获取当前用户信息', responseDto: CurrentUserGetInfoResDto })
  @Get('info')
  async getInfo() {
    return await this.currentUserService.getInfo()
  }

  @ApiDoc({ endpointSummary: '获取当前用户个人信息', responseDto: CurrentUserGetProfileResDto })
  @Get('profile')
  async getProfile() {
    return await this.currentUserService.getProfile()
  }

  @ApiDoc({ endpointSummary: '更新当前用户个人信息' })
  @Operate()
  @Post('update-profile')
  async updateProfile(@Body() data: UpdateCurrentUserProfileReqDto) {
    return await this.currentUserService.updateProfile(data)
  }

  @ApiDoc({ endpointSummary: '更新当前用户密码' })
  @Operate()
  @Post('update-password')
  async updatePassword(@Body() data: UpdateCurrentUserPasswordReqDto) {
    return await this.currentUserService.updatePassword(data)
  }
}
