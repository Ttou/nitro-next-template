import { Module } from '@nestjs/common'
import { SystemPostController } from './post.controller'
import { SystemPostService } from './post.service'

@Module({
  controllers: [SystemPostController],
  providers: [SystemPostService],
})
export class SystemPostModule {}
