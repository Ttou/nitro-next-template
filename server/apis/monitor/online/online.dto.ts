import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { SysUserEntityExcludeRelationDto } from '~db/dtos'
import { PageReqDto, PageResDto } from '~server/dtos'

/**
 * 分页查询在线用户请求
 */
export class FindMonitorOnlinePageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  userName?: string

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  nickName?: string
}

export class FindMonitorOnlinePageItemResDto extends OmitType(SysUserEntityExcludeRelationDto, ['password'] as const) {}

export class FindMonitorOnlinePageResDto extends PageResDto<FindMonitorOnlinePageItemResDto> {
  @ApiProperty({
    description: '分页数据',
    type: () => [FindMonitorOnlinePageItemResDto],
  })
  declare data: FindMonitorOnlinePageItemResDto[]
}
