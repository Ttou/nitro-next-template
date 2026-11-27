import type { SysMenuEntity } from '~db/entities/sys-menu.entity'
import type { EntityDtoSchema } from './entity-constraint'
import { z } from 'zod'
import { MenuTypeEnumValues, YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, enumField, lazySchema } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统菜单（不含关联）
 */
export const sysMenuEntityExcludeRelationSchema = lazySchema(() => ((defineSchema(baseEntitySchema().extend({
  parentId: z.string().nullish().describe('父菜单ID'),
  menuName: z.string().describe('菜单名称'),
  menuKey: z.string().describe('菜单键值'),
  menuType: enumField(MenuTypeEnumValues).describe('菜单类型'),
  orderNum: z.number().describe('排序'),
  path: z.string().nullish().describe('路径'),
  component: z.string().nullish().describe('组件'),
  redirect: z.string().nullish().describe('重定向'),
  icon: z.string().nullish().describe('图标'),
  isAvailable: enumField(YesOrNoEnumValues).describe('是否可用'),
  isCache: enumField(YesOrNoEnumValues).nullish().describe('是否缓存'),
  isFrame: enumField(YesOrNoEnumValues).nullish().describe('是否内嵌'),
  isVisible: enumField(YesOrNoEnumValues).nullish().describe('是否显示'),
  remark: z.string().nullish().describe('备注'),
}), { id: 'SysMenuEntityExcludeRelationDto' })) satisfies EntityDtoSchema<SysMenuEntity>))

export type SysMenuEntityExcludeRelationDto = z.infer<ReturnType<typeof sysMenuEntityExcludeRelationSchema>>
