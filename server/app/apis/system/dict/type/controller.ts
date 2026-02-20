import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { RemoveReqDto } from '~server/app/openapi'
import { CreateSystemDictTypeReqDto, FindSystemDictDetailByKeyReqDto, FindSystemDictDetailByKeyResDto, FindSystemDictTypePageReqDto, FindSystemDictTypePageResDto, UpdateSystemDictTypeReqDto } from './dto'
import { SystemDictTypeService } from './service'

@ApiTags('字典类型接口')
@ApiBearerAuth()
@Controller()
export class SystemDictTypeController {
  constructor(
    private readonly systemDictTypeService: SystemDictTypeService,
  ) {}

  @ApiOperation({ summary: '创建字典类型' })
  @Permission('sys.menu.system.dictType.create')
  @Post('create')
  async create(@Body() dto: CreateSystemDictTypeReqDto) {
    await this.systemDictTypeService.create(dto)
  }

  @ApiOperation({ summary: '根据字典类型查询字典数据' })
  @ApiOkResponse({ type: FindSystemDictDetailByKeyResDto })
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemDictDetailByKeyReqDto) {
    return await this.systemDictTypeService.findByKey(dto)
  }

  @ApiOperation({ summary: '查询字典类型分页列表' })
  @ApiOkResponse({ type: FindSystemDictTypePageResDto })
  @Permission('sys.menu.system.dictType.findPage')
  @Get('findPage')
  async findPage(@Body() dto: FindSystemDictTypePageReqDto) {
    return await this.systemDictTypeService.findPage(dto)
  }

  @ApiOperation({ summary: '删除字典类型' })
  @Permission('sys.menu.system.dictType.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDictTypeService.remove(dto)
  }

  @ApiOperation({ summary: '更新字典类型' })
  @Permission('sys.menu.system.dictType.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemDictTypeReqDto) {
    return await this.systemDictTypeService.update(dto)
  }
}
