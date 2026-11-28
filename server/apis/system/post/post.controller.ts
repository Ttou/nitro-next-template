import type { CreateSystemPostReqDto, FindSystemPostPageReqDto, RemoveReqDto, UpdateSystemPostReqDto } from '~shared/dtos'
import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ExcelService } from '~nestjs-modules/excel'
import { createSystemPostReqSchema, findSystemPostPageReqSchema, findSystemPostPageResSchema, removeReqSchema, updateSystemPostReqSchema } from '~shared/dtos'
import { PermissionEnum } from '~shared/enums'
import { exportSystemPostExcel } from './post.excel'
import { SystemPostService } from './post.service'

@ApiTags('系统岗位接口')
@ApiBearerAuth()
@Controller()
export class SystemPostController {
  constructor(
    private systemPostService: SystemPostService,
    private excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: '创建岗位' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_CREATE)
  @Post('create')
  async create(@Body({
    schema: createSystemPostReqSchema(),
  }) dto: CreateSystemPostReqDto,
  ) {
    return await this.systemPostService.create(dto)
  }

  @ApiOperation({ summary: '查询岗位分页列表' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: findSystemPostPageResSchema(),
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body({
    schema: findSystemPostPageReqSchema(),
  }) dto: FindSystemPostPageReqDto,
  ) {
    return await this.systemPostService.findPage(dto)
  }

  @ApiOperation({ summary: '删除岗位' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_REMOVE)
  @Delete('remove')
  async remove(@Body({
    schema: removeReqSchema(),
  }) dto: RemoveReqDto,
  ) {
    return await this.systemPostService.remove(dto)
  }

  @ApiOperation({ summary: '更新岗位' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_UPDATE)
  @Post('update')
  async update(@Body({
    schema: updateSystemPostReqSchema(),
  }) dto: UpdateSystemPostReqDto,
  ) {
    return await this.systemPostService.update(dto)
  }

  @ApiOperation({ summary: '导出岗位' })
  @ApiOkResponse({
    description: '请求成功',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_EXPORT)
  @Post('export')
  async export(@Body({
    schema: findSystemPostPageReqSchema(),
  }) dto: FindSystemPostPageReqDto,
  ) {
    const { data } = await this.systemPostService.findPage(dto)
    return this.excelService.exportFile(exportSystemPostExcel(), data)
  }
}
