import type { RedisClient } from '~server/interfaces'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { IORedisStore } from '@xlt-token/store-redis'

@Injectable()
export class CustomXltRedis extends IORedisStore {
  constructor(
    @InjectRedis() redisClient: RedisClient,
  ) {
    super(redisClient)
  }
}
