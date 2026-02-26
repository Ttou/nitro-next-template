import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AutoOperation, Permission } from '~server/app/decorators'
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

  @AutoOperation({ summary: '创建岗位' })
  @Permission('sys.menu.system.post.create')
  @Post('create')
  async create(@Body() dto: CreateSystemPostReqDto) {
    return await this.systemPostService.create(dto)
  }

  @AutoOperation({ summary: '查询岗位分页列表' })
  @ApiOkResponse({ type: FindSystemPostPageResDto })
  @Permission('sys.menu.system.post.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemPostPageReqDto) {
    return await this.systemPostService.findPage(dto)
  }

  @AutoOperation({ summary: '删除岗位' })
  @Permission('sys.menu.system.post.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemPostService.remove(dto)
  }

  @AutoOperation({ summary: '更新岗位' })
  @Permission('sys.menu.system.post.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemPostReqDto) {
    return await this.systemPostService.update(dto)
  }
}
