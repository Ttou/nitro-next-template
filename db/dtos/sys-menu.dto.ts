import { z } from 'zod'
import { MenuTypeEnumValues, YesOrNoEnumValues } from '~shared/enums'
import { enumField } from '~shared/utils'
import { baseEntitySchema } from './base.dto'

/**
 * 系统菜单（不含关联）
 */
export const sysMenuEntityExcludeRelationSchema = baseEntitySchema.extend({
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
}).meta({ id: 'SysMenuEntityExcludeRelationDto' })

export type SysMenuEntityExcludeRelationDto = z.infer<typeof sysMenuEntityExcludeRelationSchema>
