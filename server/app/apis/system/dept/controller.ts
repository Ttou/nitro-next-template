import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AutoOperation, Permission } from '~server/app/decorators'
import { RemoveReqDto } from '~server/app/extends'
import { CreateSystemDeptReqDto, FindSystemDeptListReqDto, FindSystemDeptListResDto, UpdateSystemDeptReqDto } from './dto'
import { SystemDeptService } from './service'

@ApiTags('系统部门接口')
@ApiBearerAuth()
@Controller()
export class SystemDeptController {
  constructor(
    private readonly systemDeptService: SystemDeptService,
  ) {}

  @AutoOperation({ summary: '创建部门' })
  @Permission('sys.menu.system.dept.create')
  @Post('create')
  async create(@Body() dto: CreateSystemDeptReqDto) {
    return await this.systemDeptService.create(dto)
  }

  @AutoOperation({ summary: '查询部门列表' })
  @ApiOkResponse({ schema: FindSystemDeptListResDto })
  @Permission('sys.menu.system.dept.findList')
  @Post('findList')
  async findList(@Body() dto: FindSystemDeptListReqDto) {
    return await this.systemDeptService.findList(dto)
  }

  @AutoOperation({ summary: '删除部门' })
  @Permission('sys.menu.system.dept.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDeptService.remove(dto)
  }

  @AutoOperation({ summary: '更新部门' })
  @Permission('sys.menu.system.dept.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemDeptReqDto) {
    return await this.systemDeptService.update(dto)
  }
}
