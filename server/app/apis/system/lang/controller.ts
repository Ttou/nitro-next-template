import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Public } from '~server/app/decorators'
import { AutoOperation, RemoveReqDto } from '~server/app/extends'
import { CreateSystemLangReqDto, FindSystemLangAllReqDto, FindSystemLangAllResDto, FindSystemLangOneReqDto, FindSystemLangOneResDto, FindSystemLangPageReqDto, FindSystemLangPageResDto, UpdateSystemLangReqDto } from './dto'
import { SystemLangService } from './service'

@ApiTags('系统语言接口')
@ApiBearerAuth()
@Controller()
export class SystemLangController {
  constructor(
    private readonly systemLangService: SystemLangService,
  ) {}

  @AutoOperation({ summary: '创建系统语言' })
  @Post('create')
  async create(@Body() dto: CreateSystemLangReqDto) {
    await this.systemLangService.create(dto)
  }

  @AutoOperation({ summary: '查询系统语言' })
  @ApiOkResponse({ schema: FindSystemLangAllResDto })
  @Public()
  @Get('findAll')
  async findAll(@Query() dto: FindSystemLangAllReqDto) {
    return await this.systemLangService.findAll(dto)
  }

  @AutoOperation({ summary: '查询系统语言词条' })
  @ApiOkResponse({ schema: FindSystemLangOneResDto })
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemLangOneReqDto) {
    return await this.systemLangService.findByKey(dto)
  }

  @AutoOperation({ summary: '查询系统语言词条分页' })
  @ApiOkResponse({ type: FindSystemLangPageResDto })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemLangPageReqDto) {
    return await this.systemLangService.findPage(dto)
  }

  @AutoOperation({ summary: '删除系统语言词条' })
  @Post('remove')
  async remove(@Body() dto: RemoveReqDto) {
    await this.systemLangService.remove(dto)
  }

  @AutoOperation({ summary: '更新系统语言词条' })
  @Post('update')
  async update(@Body() dto: UpdateSystemLangReqDto) {
    await this.systemLangService.update(dto)
  }
}
