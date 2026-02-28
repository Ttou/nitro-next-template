import type { ISchema } from '~server/app/extends'
import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsNotEmpty, IsUUID } from 'class-validator'

export class AssignMenuForRoleReqDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string

  @ApiProperty({ description: '菜单ID数组' })
  @ArrayNotEmpty({ message: 'ID数组不能为空' })
  @IsUUID('7', { each: true, message: 'ID格式不正确' })
  menuIds: Array<string>
}

export class FindAssignedMenuForRoleReqDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export const FindAssignedMenuForRoleResDto: ISchema = {
  type: 'array',
  items: {
    type: 'string',
  },
}
