import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Transform } from 'class-transformer'
import { ArrayNotEmpty } from 'class-validator'
import { PageReqDto, PageResDto } from '~server/extends'

export class FindMonitorCachePageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '缓存键' })
  key?: string
}

export class FindMonitorCachePageItemResDto {
  @ApiProperty({ description: '缓存键' })
  @Transform(({ value, options }) => value.replace(options.cacheKeyPrefix, ''))
  key: string

  @Exclude()
  value: string

  @ApiProperty({ description: '缓存过期时间' })
  @Transform(({ value }) => Date.now() + Number(value) * 1000)
  ttl: number

  @Exclude()
  error?: unknown
}

export class FindMonitorCachePageResDto extends PageResDto(FindMonitorCachePageItemResDto) {}

export class RemoveMonitorCacheReqDto {
  @ApiProperty({
    description: '缓存键数组',
    type: 'array',
    items: { type: 'string' },
  })
  @ArrayNotEmpty({ message: '缓存键数组不能为空' })
  keys: string[]
}
