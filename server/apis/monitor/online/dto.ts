import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsDateString, IsOptional } from 'class-validator'
import { SysOnlineEntityNoRelations, SysUserEntityNoRelations } from '~server/entities'
import { PageReqDto, PageResDto, UserAgentSerializeDto } from '~server/extends'

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

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsDateString({ }, { message: '开始时间格式不正确' })
  beginTime?: string

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsDateString({ }, { message: '结束时间格式不正确' })
  endTime?: string
}

class SysOnlineEntityNoToken extends OmitType(SysOnlineEntityNoRelations, ['token', 'userAgent']) {
  @ApiProperty({ description: '用户代理', type: () => UserAgentSerializeDto })
  userAgent: UserAgentSerializeDto

  @ApiProperty({ description: '用户', type: () => SysUserEntityNoRelations })
  user: SysUserEntityNoRelations
}

/**
 * 分页查询在线用户响应
 */
export class FindMonitorOnlinePageResDto extends PageResDto(SysOnlineEntityNoToken) {}
