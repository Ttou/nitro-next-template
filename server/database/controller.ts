import { MikroORM } from '@mikro-orm/core'
import { Controller, Get } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { Public } from '~server/decorators'
import { AllSeeders } from './seeders'

@ApiExcludeController()
@Controller('database')
export class DatabaseController {
  constructor(
    private readonly orm: MikroORM,
  ) {}

  @Public()
  @Get('init')
  async init() {
    await this.orm.schema.refresh()
    return '初始化数据库结构成功'
  }

  @Public()
  @Get('seed')
  async seed() {
    await this.orm.seeder.seed(AllSeeders)
    return '初始化数据库数据成功'
  }
}
