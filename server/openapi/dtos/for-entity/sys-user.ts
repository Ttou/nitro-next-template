import type { IYesOrNoEnum } from '~shared/enums'
import { Collection } from '@mikro-orm/core'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { SysDeptEntity, SysPostEntity, SysRoleEntity, SysUserEntity } from '~db/entities'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'
import { SysDeptEntityDto } from './sys-dept'
import { SysPostEntityDto } from './sys-post'
import { SysRoleEntityDto } from './sys-role'

export class SysUserEntityDto extends BaseEntityDto implements SysUserEntity {
  @ApiProperty({ description: '账号' })
  userName: string

  @ApiProperty({ description: '昵称' })
  nickName: string

  @ApiProperty({ description: '密码' })
  password: string

  @ApiProperty({ description: '邮箱' })
  email?: INullable<string>

  @ApiProperty({ description: '手机号码' })
  phone?: INullable<string>

  @ApiProperty({ description: '性别' })
  sex?: INullable<string>

  @ApiProperty({ description: '头像' })
  avatar?: INullable<string>

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '是否删除', enum: YesOrNoEnumMap })
  isDelete: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark?: INullable<string>

  @ApiProperty({
    description: '部门列表',
    type: () => [SysDeptEntityDto],
  })
  depts: Collection<SysDeptEntity, SysUserEntity>

  @ApiProperty({
    description: '岗位列表',
    type: () => [SysPostEntityDto],
  })
  posts: Collection<SysPostEntity, SysUserEntity>

  @ApiProperty({
    description: '角色列表',
    type: () => [SysRoleEntityDto],
  })
  roles: Collection<SysRoleEntity, SysUserEntity>
}

export class SysUserEntityExcludeRelationDto extends OmitType(SysUserEntityDto, ['depts', 'posts', 'roles'] as const) {}
