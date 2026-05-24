import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CustomCacheInterceptor } from '~server/customs'
import { Operate, Permission } from '~server/decorators'
import { ApiExcelResponse, RemoveReqDto } from '~server/openapi'
import { ExcelService } from '~server/shared'
import { parseMs } from '~shared/utils'
import { CreateSystemConfigReqDto, ExportSystemConfigSerializeDto, FindSystemConfigByKeyReqDto, FindSystemConfigByKeyResDto, FindSystemConfigPageReqDto, FindSystemConfigPageResDto, UpdateSystemConfigReqDto } from './dto'
import { SystemConfigService } from './service'

@ApiTags('系统配置接口')
@ApiBearerAuth()
@Controller()
export class SystemConfigController {
  constructor(
    private systemConfigService: SystemConfigService,
    private excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: '创建系统配置' })
  @Operate()
  @Permission('sys.menu.system.config.create')
  @Post('create')
  async create(@Body() dto: CreateSystemConfigReqDto) {
    return await this.systemConfigService.create(dto)
  }

  @ApiOperation({ summary: '根据键名查询系统配置' })
  @ApiOkResponse({ type: FindSystemConfigByKeyResDto })
  @CacheKey(ctx => `sys_config:${ctx.switchToHttp().getRequest().query.configKey}`)
  @CacheTTL(parseMs('milliseconds', '1d'))
  @UseInterceptors(CustomCacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemConfigByKeyReqDto) {
    return await this.systemConfigService.findByKey(dto)
  }

  @ApiOperation({ summary: '查询系统配置分页列表' })
  @ApiOkResponse({ type: FindSystemConfigPageResDto })
  @Permission('sys.menu.system.config.findPage')
  @Operate({ ignoreResponse: true })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemConfigPageReqDto) {
    return await this.systemConfigService.findPage(dto)
  }

  @ApiOperation({ summary: '删除系统配置' })
  @Permission('sys.menu.system.config.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemConfigService.remove(dto)
  }

  @ApiOperation({ summary: '更新系统配置' })
  @Permission('sys.menu.system.config.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemConfigReqDto) {
    return await this.systemConfigService.update(dto)
  }

  @ApiOperation({ summary: '导出系统配置' })
  @ApiExcelResponse()
  @Permission('sys.menu.system.config.export')
  @Operate({ ignoreResponse: true })
  @Post('export')
  async export(@Body() dto: FindSystemConfigPageReqDto) {
    const { data } = await this.systemConfigService.findPage(dto)
    return this.excelService.exportFile(ExportSystemConfigSerializeDto, data)
  }
}
