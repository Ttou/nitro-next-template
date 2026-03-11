import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CacheKey, CacheTTL, OperateLog, Permission } from '~server/decorators'
import { ApiExcelResponse, CacheInterceptor, ExcelService, RemoveReqDto } from '~server/extends'
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
  @OperateLog()
  @Permission('sys.menu.system.config.create')
  @Post('create')
  async create(@Body() dto: CreateSystemConfigReqDto) {
    return await this.systemConfigService.create(dto)
  }

  @ApiOperation({ summary: '根据键名查询系统配置' })
  @ApiOkResponse({ type: FindSystemConfigByKeyResDto })
  @CacheKey(req => `sys_config:${req.query.configKey}`)
  @CacheTTL('1d')
  @UseInterceptors(CacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemConfigByKeyReqDto) {
    return await this.systemConfigService.findByKey(dto)
  }

  @ApiOperation({ summary: '查询系统配置分页列表' })
  @ApiOkResponse({ type: FindSystemConfigPageResDto })
  @Permission('sys.menu.system.config.findPage')
  @OperateLog()
  @Post('findPage')
  async findPage(@Body() dto: FindSystemConfigPageReqDto) {
    return await this.systemConfigService.findPage(dto)
  }

  @ApiOperation({ summary: '删除系统配置' })
  @Permission('sys.menu.system.config.remove')
  @OperateLog()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemConfigService.remove(dto)
  }

  @ApiOperation({ summary: '更新系统配置' })
  @Permission('sys.menu.system.config.update')
  @OperateLog()
  @Post('update')
  async update(@Body() dto: UpdateSystemConfigReqDto) {
    return await this.systemConfigService.update(dto)
  }

  @ApiOperation({ summary: '导出系统配置' })
  @ApiExcelResponse()
  @Permission('sys.menu.system.config.export')
  @OperateLog()
  @Post('export')
  async export(@Body() dto: FindSystemConfigPageReqDto) {
    const { data } = await this.systemConfigService.findPage(dto)
    return this.excelService.exportFile(ExportSystemConfigSerializeDto, data)
  }
}
