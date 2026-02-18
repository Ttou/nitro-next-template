import { Module } from '@nestjs/common'
import { SystemDeptController } from './controller'
import { SystemDeptService } from './service'

@Module({
  controllers: [SystemDeptController],
  providers: [SystemDeptService],
})
export class SystemDeptModule {}
