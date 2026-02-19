import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { RemoveReqDto } from '~server/app/openapi'
import { CreateSystemPostReqDto, FindSystemPostPageReqDto, FindSystemPostPageResDto, UpdateSystemPostReqDto } from './dto'
import { SystemPostService } from './service'

@ApiTags('系统岗位接口')
@ApiBearerAuth()
@Controller()
export class SystemPostController {
  constructor(
    private readonly systemPostService: SystemPostService,
  ) {}

  @ApiOperation({ summary: '创建岗位' })
  @Permission('sys.menu.system.post.create')
  @Post('create')
  async create(@Body() dto: CreateSystemPostReqDto) {
    return await this.systemPostService.create(dto)
  }

  @ApiOperation({ summary: '查询岗位分页列表' })
  @ApiOkResponse({ type: FindSystemPostPageResDto })
  @Permission('sys.menu.system.post.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemPostPageReqDto) {
    return await this.systemPostService.findPage(dto)
  }

  @ApiOperation({ summary: '删除岗位' })
  @Permission('sys.menu.system.post.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemPostService.remove(dto)
  }

  @ApiOperation({ summary: '更新岗位' })
  @Permission('sys.menu.system.post.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemPostReqDto) {
    return await this.systemPostService.update(dto)
  }
}
