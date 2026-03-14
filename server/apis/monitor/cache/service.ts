import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { CacheService, RedisService } from '~server/extends'
import { FindMonitorCachePageItemResDto, FindMonitorCachePageReqDto, RemoveMonitorCacheReqDto } from './dto'

@Injectable()
export class MonitorCacheService {
  constructor(
    private redisService: RedisService,
    private cacheService: CacheService,
  ) {}

  async findPage(dto: FindMonitorCachePageReqDto) {
    const { key, page, pageSize } = dto
    let pattern = this.getCacheKey(key ?? '*')
    // 确保模式以 :* 结尾
    if (!pattern.endsWith(':*')) {
      pattern += ':*'
    }

    const { data, ...rest } = await this.redisService.page(pattern, page, pageSize)

    const items = plainToInstance(FindMonitorCachePageItemResDto, data, { cacheKeyPrefix: this.getCacheKey('') })

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

  private getCacheKey(key: string) {
    return [this.cacheService.options.keyPrefix, key].join(this.cacheService.options.keyPrefixSeparator)
  }
}
