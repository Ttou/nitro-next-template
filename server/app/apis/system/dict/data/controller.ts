import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { RemoveReqDto } from '~server/app/openapi'
import { CreateSystemDictDataReqDto, FindSystemDictDataListReqDto, FindSystemDictDataListResDto, UpdateSystemDictDataReqDto } from './dto'
import { SystemDictDataService } from './service'

@ApiTags('字典数据接口')
@ApiBearerAuth()
@Controller()
export class SystemDictDataController {
  constructor(
    private readonly systemDictDataService: SystemDictDataService,
  ) {}

  @ApiOperation({ summary: '创建字典数据' })
  @Permission('sys.menu.system.dictData.create')
  @Post('create')
  async create(@Body() dto: CreateSystemDictDataReqDto) {
    await this.systemDictDataService.create(dto)
  }

  @ApiOperation({ summary: '查询字典数据列表' })
  @ApiOkResponse({ type: FindSystemDictDataListResDto })
  @Permission('sys.menu.system.dictData.findList')
  @Post('findList')
  async findList(@Body() dto: FindSystemDictDataListReqDto) {
    return await this.systemDictDataService.findList(dto)
  }

  @ApiOperation({ summary: '删除字典数据' })
  @Permission('sys.menu.system.dictData.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDictDataService.remove(dto)
  }

  @ApiOperation({ summary: '更新字典数据' })
  @Permission('sys.menu.system.dictData.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemDictDataReqDto) {
    return await this.systemDictDataService.update(dto)
  }
}
