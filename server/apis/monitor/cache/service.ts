import { BadRequestException, Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { ErrorEnum } from '~server/constants'
import { CacheService, RedisExtendService } from '~server/shared'
import { FindMonitorCacheByKeyReqDto, FindMonitorCachePageItemResDto, FindMonitorCachePageReqDto, RemoveMonitorCacheReqDto } from './dto'

@Injectable()
export class MonitorCacheService {
  constructor(
    private cacheService: CacheService,
    private redisExtendService: RedisExtendService,
  ) {}

  async findPage(dto: FindMonitorCachePageReqDto) {
    const { key, page, pageSize } = dto
    let pattern = this.cacheService.getKey(key ?? '*')

    // 确保模式以 :* 结尾
    if (!pattern.endsWith(':*')) {
      pattern += ':*'
    }

    const { data, ...rest } = await this.redisExtendService.page(pattern, page, pageSize)

    const items = plainToInstance(FindMonitorCachePageItemResDto, data, { cacheKeyPrefix: this.cacheService.getKey('') })

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
