import { Module } from '@nestjs/common'
import { DatabaseController } from './controller'

@Module({
  controllers: [DatabaseController],
})
export class DatabaseModule {}
