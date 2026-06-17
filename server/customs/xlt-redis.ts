import { IORedisStore } from '@xlt-token/store-redis'
import { Redis } from 'ioredis'
import { SharedConfig } from '~server/configs'

export class CustomXltRedis {
  private readonly client = new Redis({ ...SharedConfig.redis, lazyConnect: true })

  async init() {
    try {
      await this.client.connect()
    }
    catch (error) {
      console.error(error)
    }
  }

  async close() {
    await this.client?.quit()
  }

  getStore() {
    return new IORedisStore(this.client)
  }
}
