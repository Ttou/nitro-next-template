import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Operate, Permission } from '~server/decorators'
import { RemoveReqDto } from '~server/openapi'
import { CreateSystemDeptReqDto, FindSystemDeptListReqDto, FindSystemDeptListResDto, UpdateSystemDeptReqDto } from './dto'
import { SystemDeptService } from './service'

@ApiTags('系统部门接口')
@ApiBearerAuth()
@Controller()
export class SystemDeptController {
  constructor(
    private systemDeptService: SystemDeptService,
  ) {}

  @ApiOperation({ summary: '创建部门' })
  @Permission('sys.menu.system.dept.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemDeptReqDto) {
    return await this.systemDeptService.create(dto)
  }

  @ApiOperation({ summary: '查询部门列表' })
  @ApiOkResponse({ type: [FindSystemDeptListResDto] })
  @Permission('sys.menu.system.dept.findList')
  @Operate({ ignoreResponse: true })
  @Post('findList')
  async findList(@Body() dto: FindSystemDeptListReqDto) {
    return await this.systemDeptService.findList(dto)
  }

  @ApiOperation({ summary: '删除部门' })
  @Permission('sys.menu.system.dept.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDeptService.remove(dto)
  }

  @ApiOperation({ summary: '更新部门' })
  @Permission('sys.menu.system.dept.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemDeptReqDto) {
    return await this.systemDeptService.update(dto)
  }
}
