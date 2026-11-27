import type { FindMonitorCacheByKeyReqDto, FindMonitorCachePageReqDto, RemoveMonitorCacheReqDto } from '~shared/dtos'
import { BadRequestException, Injectable } from '@nestjs/common'
import { CacheRedisExtendService, CacheService } from '~nestjs-modules/cache'
import { ErrorEnum } from '~server/constants'

@Injectable()
export class MonitorCacheService {
  constructor(
    private cacheService: CacheService,
    private cacheRedisExtendService: CacheRedisExtendService,
  ) {}

  async findPage(dto: FindMonitorCachePageReqDto) {
    const { key, page, pageSize } = dto
    let pattern = this.cacheService.getKey(key ?? '*')

    // 确保模式以 :* 结尾
    if (!pattern.endsWith(':*')) {
      pattern += ':*'
    }

    const { data, ...rest } = await this.cacheRedisExtendService.page(pattern, page, pageSize)

    const cacheKeyPrefix = this.cacheService.getKey('')
    const items = data.map(item => ({
      key: item.key.replace(cacheKeyPrefix, ''),
      ttl: Date.now() + Number(item.ttl) * 1000,
    }))

    return {
      data: items,
      ...rest,
    }
  }

  async findByKey(dto: FindMonitorCacheByKeyReqDto) {
    const { cacheKey } = dto

    const oldRecord = await this.cacheService.get(cacheKey)

    if (!oldRecord) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.CACHE_NOT_FOUND_ERROR))
    }

    return oldRecord
  }

  async remove(dto: RemoveMonitorCacheReqDto) {
    const { keys } = dto

    await this.cacheService.deleteMany(keys)
  }

  async clear() {
    await this.cacheService.clear()
  }
}
