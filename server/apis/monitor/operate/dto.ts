import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsDateString, IsOptional } from 'class-validator'
import { PageReqDto, SysOperateEntityExcludeRelationDto, SysUserEntityExcludeRelationDto, UserAgentSerDto } from '~server/openapi'

/**
 * 分页查询操作日志请求
 */
export class FindMonitorOperatePageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  userName?: string

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  nickName?: string

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsDateString({ }, { message: '开始时间格式不正确' })
  beginTime?: string

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsDateString({ }, { message: '结束时间格式不正确' })
  endTime?: string
}

export class SysOperateLogEntityWithUserDto extends OmitType(SysOperateEntityExcludeRelationDto, ['userAgent'] as const) {
  @ApiProperty({ description: '用户代理', type: () => UserAgentSerDto })
  userAgent: UserAgentSerDto

  @ApiProperty({ description: '用户', type: () => SysUserEntityExcludeRelationDto })
  user: SysUserEntityExcludeRelationDto
}
