import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { CacheKey, CacheTTL, Permission } from '~server/app/decorators'
import { AutoOperation, RemoveReqDto } from '~server/app/extends'
import { CacheInterceptor } from '~server/app/interceptors'
import { CreateSystemConfigReqDto, FindSystemConfigByKeyReqDto, FindSystemConfigByKeyResDto, FindSystemConfigPageReqDto, FindSystemConfigPageResDto, UpdateSystemConfigReqDto } from './dto'
import { SystemConfigService } from './service'

@ApiTags('系统配置接口')
@ApiBearerAuth()
@Controller()
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  @AutoOperation({ summary: '创建系统配置' })
  @Permission('sys.menu.system.config.create')
  @Post('create')
  async create(@Body() dto: CreateSystemConfigReqDto) {
    return await this.systemConfigService.create(dto)
  }

  @AutoOperation({ summary: '根据键名查询系统配置' })
  @ApiOkResponse({ type: FindSystemConfigByKeyResDto })
  @CacheKey(req => `sys_config:${req.query.configKey}`)
  @CacheTTL('1d')
  @UseInterceptors(CacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemConfigByKeyReqDto) {
    return await this.systemConfigService.findByKey(dto)
  }

  @AutoOperation({ summary: '查询系统配置分页列表' })
  @ApiOkResponse({ type: FindSystemConfigPageResDto })
  @Permission('sys.menu.system.config.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemConfigPageReqDto) {
    return await this.systemConfigService.findPage(dto)
  }

  @AutoOperation({ summary: '删除系统配置' })
  @Permission('sys.menu.system.config.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemConfigService.remove(dto)
  }

  @AutoOperation({ summary: '更新系统配置' })
  @Permission('sys.menu.system.config.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemConfigReqDto) {
    return await this.systemConfigService.update(dto)
  }
}
