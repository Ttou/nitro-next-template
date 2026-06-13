import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltIgnore } from '@xlt-token/nestjs'
import { Operate } from '~server/decorators'
import { ApiDoc, RemoveReqDto, SysLangEntityDto } from '~server/openapi'
import { CreateSystemLangReqDto, FindSystemLangAllReqDto, FindSystemLangOneReqDto, FindSystemLangPageReqDto, UpdateSystemLangReqDto } from './dto'
import { SystemLangService } from './service'

@ApiTags('系统语言接口')
@ApiBearerAuth()
@Controller()
export class SystemLangController {
  constructor(
    private systemLangService: SystemLangService,
  ) {}

  @ApiDoc({ endpointSummary: '创建系统语言' })
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemLangReqDto) {
    await this.systemLangService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询系统语言', responseDto: Object })
  @XltIgnore()
  @Get('findAll')
  async findAll(@Query() dto: FindSystemLangAllReqDto) {
    return await this.systemLangService.findAll(dto)
  }

  @ApiDoc({ endpointSummary: '查询系统语言词条', responseDto: SysLangEntityDto })
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemLangOneReqDto) {
    return await this.systemLangService.findByKey(dto)
  }

  @ApiDoc({ endpointSummary: '查询系统语言词条分页', responseDto: SysLangEntityDto, isPage: true })
  @Operate({ ignoreResponse: true })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemLangPageReqDto) {
    return await this.systemLangService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除系统语言词条' })
  @Operate()
  @Post('remove')
  async remove(@Body() dto: RemoveReqDto) {
    await this.systemLangService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新系统语言词条' })
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemLangReqDto) {
    await this.systemLangService.update(dto)
  }
}
