import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ExcelService } from '~nestjs-modules/excel'
import { ApiDoc } from '~server/decorators'
import { SysPostEntityExcludeRelationDto } from '~db/dtos'
import { RemoveReqDto } from '~server/dtos'
import { PermissionEnum } from '~shared/enums'
import { CreateSystemPostReqDto, ExportSystemPostSerDto, FindSystemPostPageReqDto, UpdateSystemPostReqDto } from './post.dto'
import { SystemPostService } from './post.service'

@ApiTags('系统岗位接口')
@ApiBearerAuth()
@Controller()
export class SystemPostController {
  constructor(
    private systemPostService: SystemPostService,
    private excelService: ExcelService,
  ) {}

  @ApiDoc({ endpointSummary: '创建岗位' })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_CREATE)
  @Post('create')
  async create(@Body() dto: CreateSystemPostReqDto) {
    return await this.systemPostService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询岗位分页列表', responseDto: SysPostEntityExcludeRelationDto, isPage: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body() dto: FindSystemPostPageReqDto) {
    return await this.systemPostService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除岗位' })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemPostService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新岗位' })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_UPDATE)
  @Post('update')
  async update(@Body() dto: UpdateSystemPostReqDto) {
    return await this.systemPostService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出岗位', isExcel: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_EXPORT)
  @Post('export')
  async export(@Body() dto: FindSystemPostPageReqDto) {
    const { data } = await this.systemPostService.findPage(dto)
    return this.excelService.exportFile(ExportSystemPostSerDto, data)
  }
}
