import { Module } from '@nestjs/common'
import { SystemPostController } from './controller'
import { SystemPostService } from './service'

@Module({
  controllers: [SystemPostController],
  providers: [SystemPostService],
})
export class SystemPostModule {}
