import { ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { PageReqDto, SysUserEntityExcludeRelationDto } from '~server/openapi'

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

export class FindMonitorOnlinePageResDto extends OmitType(SysUserEntityExcludeRelationDto, ['password'] as const) {}
