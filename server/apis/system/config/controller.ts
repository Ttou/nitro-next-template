import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CustomCacheInterceptor } from '~server/customs'
import { Operate, Permission } from '~server/decorators'
import { ApiDoc, RemoveReqDto, SysConfigEntityDto } from '~server/openapi'
import { ExcelService } from '~server/shared'
import { parseMs } from '~shared/utils'
import { CreateSystemConfigReqDto, ExportSystemConfigSerDto, FindSystemConfigByKeyReqDto, FindSystemConfigPageReqDto, UpdateSystemConfigReqDto } from './dto'
import { SystemConfigService } from './service'

@ApiTags('系统配置接口')
@ApiBearerAuth()
@Controller()
export class SystemConfigController {
  constructor(
    private systemConfigService: SystemConfigService,
    private excelService: ExcelService,
  ) {}

  @ApiDoc({ endpointSummary: '创建系统配置' })
  @Operate()
  @Permission('sys.menu.system.config.create')
  @Post('create')
  async create(@Body() dto: CreateSystemConfigReqDto) {
    return await this.systemConfigService.create(dto)
  }

  @ApiDoc({ endpointSummary: '根据键名查询系统配置', responseDto: SysConfigEntityDto })
  @CacheKey(ctx => `sys_config:${ctx.switchToHttp().getRequest().query.configKey}`)
  @CacheTTL(parseMs('milliseconds', '1d'))
  @UseInterceptors(CustomCacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemConfigByKeyReqDto) {
    return await this.systemConfigService.findByKey(dto)
  }

  @ApiDoc({ endpointSummary: '查询系统配置分页列表', responseDto: SysConfigEntityDto, isPage: true })
  @Permission('sys.menu.system.config.findPage')
  @Operate({ ignoreResponse: true })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemConfigPageReqDto) {
    return await this.systemConfigService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除系统配置' })
  @Permission('sys.menu.system.config.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemConfigService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新系统配置' })
  @Permission('sys.menu.system.config.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemConfigReqDto) {
    return await this.systemConfigService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出系统配置', isExcel: true })
  @Permission('sys.menu.system.config.export')
  @Operate({ ignoreResponse: true })
  @Post('export')
  async export(@Body() dto: FindSystemConfigPageReqDto) {
    const { data } = await this.systemConfigService.findPage(dto)
    return this.excelService.exportFile(ExportSystemConfigSerDto, data)
  }
}
