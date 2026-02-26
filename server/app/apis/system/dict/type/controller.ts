import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AutoOperation, CacheKey, CacheTTL, Permission } from '~server/app/decorators'
import { CacheInterceptor } from '~server/app/interceptors'
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

  @AutoOperation({ summary: '创建字典类型' })
  @Permission('sys.menu.system.dictType.create')
  @Post('create')
  async create(@Body() dto: CreateSystemDictTypeReqDto) {
    await this.systemDictTypeService.create(dto)
  }

  @AutoOperation({ summary: '根据字典类型查询字典数据' })
  @ApiOkResponse({ type: FindSystemDictDetailByKeyResDto })
  @CacheKey(req => `sys_dict:${req.query.dictType}`)
  @CacheTTL('1d')
  @UseInterceptors(CacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemDictDetailByKeyReqDto) {
    return await this.systemDictTypeService.findByKey(dto)
  }

  @AutoOperation({ summary: '查询字典类型分页列表' })
  @ApiOkResponse({ type: FindSystemDictTypePageResDto })
  @Permission('sys.menu.system.dictType.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemDictTypePageReqDto) {
    return await this.systemDictTypeService.findPage(dto)
  }

  @AutoOperation({ summary: '删除字典类型' })
  @Permission('sys.menu.system.dictType.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDictTypeService.remove(dto)
  }

  @AutoOperation({ summary: '更新字典类型' })
  @Permission('sys.menu.system.dictType.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemDictTypeReqDto) {
    return await this.systemDictTypeService.update(dto)
  }
}
