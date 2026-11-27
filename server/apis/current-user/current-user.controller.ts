import type { UpdateCurrentUserPasswordReqDto, UpdateCurrentUserProfileReqDto } from '~shared/dtos'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { currentUserGetInfoResSchema, currentUserGetProfileResSchema, updateCurrentUserPasswordReqSchema, updateCurrentUserProfileReqSchema } from '~shared/dtos'
import { CurrentUserService } from './current-user.service'

@ApiTags('当前用户接口')
@ApiBearerAuth()
@Controller()
export class CurrentUserController {
  constructor(
    private currentUserService: CurrentUserService,
  ) {}

  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: currentUserGetInfoResSchema(),
  })
  @Get('info')
  async getInfo() {
    return await this.currentUserService.getInfo()
  }

  @ApiOperation({ summary: '获取当前用户个人信息' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: currentUserGetProfileResSchema(),
  })
  @Get('profile')
  async getProfile() {
    return await this.currentUserService.getProfile()
  }

  @ApiOperation({ summary: '更新当前用户个人信息' })
  @ApiOkResponse({ description: '请求成功' })
  @Post('update-profile')
  async updateProfile(@Body({
    schema: updateCurrentUserProfileReqSchema(),
  }) data: UpdateCurrentUserProfileReqDto,
  ) {
    return await this.currentUserService.updateProfile(data)
  }

  @ApiOperation({ summary: '更新当前用户密码' })
  @ApiOkResponse({ description: '请求成功' })
  @Post('update-password')
  async updatePassword(@Body({
    schema: updateCurrentUserPasswordReqSchema(),
  }) data: UpdateCurrentUserPasswordReqDto,
  ) {
    return await this.currentUserService.updatePassword(data)
  }
}
