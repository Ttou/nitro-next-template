import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { CacheService, RedisExtendService } from '~server/shared'
import { FindMonitorCachePageItemResDto, FindMonitorCachePageReqDto, RemoveMonitorCacheReqDto } from './dto'

@Injectable()
export class MonitorCacheService {
  constructor(
    private cacheService: CacheService,
    private redisExtendService: RedisExtendService,
  ) {}

  async findPage(dto: FindMonitorCachePageReqDto) {
    const { key, page, pageSize } = dto
    let pattern = this.cacheService.getCacheKey(key ?? '*')
    // 确保模式以 :* 结尾
    if (!pattern.endsWith(':*')) {
      pattern += ':*'
    }

    const { data, ...rest } = await this.redisExtendService.page(pattern, page, pageSize)

    const items = plainToInstance(FindMonitorCachePageItemResDto, data, { cacheKeyPrefix: this.cacheService.getCacheKey('') })

    return {
      data: items,
      ...rest,
    }
  }

  async remove(dto: RemoveMonitorCacheReqDto) {
    const { keys } = dto

    await this.cacheService.deleteMany(keys)
  }

  async clear() {
    await this.cacheService.clear()
  }
}
