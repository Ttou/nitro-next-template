import type { CreateSystemConfigReqDto, FindSystemConfigByKeyReqDto, FindSystemConfigPageReqDto, RemoveReqDto, UpdateSystemConfigReqDto } from '~shared/dtos'
import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { CacheInterceptor, CacheKey, CacheTTL } from '~nestjs-modules/cache'
import { ExcelService } from '~nestjs-modules/excel'
import { createSystemConfigReqSchema, findSystemConfigByKeyReqSchema, findSystemConfigPageReqSchema, findSystemConfigPageResSchema, removeReqSchema, sysConfigEntitySchema, updateSystemConfigReqSchema } from '~shared/dtos'
import { PermissionEnum } from '~shared/enums'
import { exportSystemConfigExcel } from './config.excel'
import { SystemConfigService } from './config.service'

@ApiTags('系统配置接口')
@ApiBearerAuth()
@Controller()
export class SystemConfigController {
  constructor(
    private systemConfigService: SystemConfigService,
    private excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: '创建系统配置' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_CONFIG_CREATE)
  @Post('create')
  async create(@Body({
    schema: createSystemConfigReqSchema(),
  }) dto: CreateSystemConfigReqDto,
  ) {
    return await this.systemConfigService.create(dto)
  }

  @ApiOperation({ summary: '根据键名查询系统配置' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: sysConfigEntitySchema(),
  })
  @CacheKey(ctx => `sys_config:${ctx.switchToHttp().getRequest().query.configKey}`)
  @CacheTTL('1d')
  @UseInterceptors(CacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query({
    schema: findSystemConfigByKeyReqSchema(),
  }) dto: FindSystemConfigByKeyReqDto,
  ) {
    return await this.systemConfigService.findByKey(dto)
  }

  @ApiOperation({ summary: '查询系统配置分页列表' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: findSystemConfigPageResSchema(),
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_CONFIG_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body({
    schema: findSystemConfigPageReqSchema(),
  }) dto: FindSystemConfigPageReqDto,
  ) {
    return await this.systemConfigService.findPage(dto)
  }

  @ApiOperation({ summary: '删除系统配置' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_CONFIG_REMOVE)
  @Delete('remove')
  async remove(@Body({
    schema: removeReqSchema(),
  }) dto: RemoveReqDto,
  ) {
    return await this.systemConfigService.remove(dto)
  }

  @ApiOperation({ summary: '更新系统配置' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_CONFIG_UPDATE)
  @Post('update')
  async update(@Body({
    schema: updateSystemConfigReqSchema(),
  }) dto: UpdateSystemConfigReqDto,
  ) {
    return await this.systemConfigService.update(dto)
  }

  @ApiOperation({ summary: '导出系统配置' })
  @ApiOkResponse({
    description: '请求成功',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_CONFIG_EXPORT)
  @Post('export')
  async export(@Body({
    schema: findSystemConfigPageReqSchema(),
  }) dto: FindSystemConfigPageReqDto,
  ) {
    const { data } = await this.systemConfigService.findPage(dto)
    return this.excelService.exportFile(exportSystemConfigExcel(), data)
  }
}
