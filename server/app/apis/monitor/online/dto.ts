import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional } from 'class-validator'
import { SysOnlineEntity, SysUserEntity } from '~server/app/entities'
import { PageReqDto, PageResDto } from '~server/app/extends'

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

/**
 * 分页查询在线用户响应
 */
export class FindMonitorOnlinePageResDto extends PageResDto(SysOnlineEntity) {}
