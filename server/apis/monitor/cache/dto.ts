import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Transform } from 'class-transformer'
import { ArrayNotEmpty, IsNotEmpty, IsOptional } from 'class-validator'
import { PageReqDto } from '~server/openapi'

export class FindMonitorCachePageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '缓存键' })
  @IsOptional()
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

export class FindMonitorCacheByKeyReqDto {
  @ApiProperty({ description: '缓存键名' })
  @IsNotEmpty({ message: '缓存键名不能为空' })
  cacheKey: string
}

export class RemoveMonitorCacheReqDto {
  @ApiProperty({
    description: '缓存键数组',
    type: 'array',
    items: { type: 'string' },
  })
  @ArrayNotEmpty({ message: '缓存键数组不能为空' })
  keys: string[]
}
