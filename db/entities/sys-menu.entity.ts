import { defineEntity, p } from '@mikro-orm/core'
import { MenuTypeEnumValues, YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'
import { SysRoleEntity } from './sys-role.entity.ts'

const SysMenuEntitySchema = defineEntity({
  name: 'SysMenuEntity',
  tableName: 'sys_menu',
  extends: BaseEntity,
  properties: {
    parentId: p.string().nullable(),
    menuName: p.string(),
    menuKey: p.string().unique(),
    menuType: p.enum(MenuTypeEnumValues),
    orderNum: p.integer(),
    path: p.string().nullable(),
    component: p.string().nullable(),
    redirect: p.string().nullable(),
    icon: p.string().nullable(),
    isAvailable: p.enum(YesOrNoEnumValues),
    isCache: p.enum(YesOrNoEnumValues).nullable(),
    isFrame: p.enum(YesOrNoEnumValues).nullable(),
    isVisible: p.enum(YesOrNoEnumValues).nullable(),
    remark: p.string().nullable(),
    roles: () => p.manyToMany(SysRoleEntity).mappedBy('menus'),
  },
})

export class SysMenuEntity extends SysMenuEntitySchema.class {}

SysMenuEntitySchema.setClass(SysMenuEntity)
