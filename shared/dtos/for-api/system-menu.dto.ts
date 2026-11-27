import { z } from 'zod'
import { enumOf, optionalEnumOf, optionalText, requiredText, uuid } from '~shared/dtos/zod'
import { MenuTypeEnumValues, YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, lazySchema } from '~shared/utils'

export const findSystemMenuListReqSchema = lazySchema(() => defineSchema(z.object({
  menuName: optionalText().describe('菜单名称'),
  menuKey: optionalText().describe('菜单标识'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
}), { id: 'FindSystemMenuListReqDto' }))

export type FindSystemMenuListReqDto = z.infer<ReturnType<typeof findSystemMenuListReqSchema>>

export const createSystemMenuReqSchema = lazySchema(() => defineSchema(z.object({
  parentId: uuid('父菜单ID格式不正确').nullish().transform(value => value ?? undefined).describe('父菜单ID'),
  menuKey: requiredText('菜单标识不能为空').describe('菜单标识'),
  menuName: requiredText('菜单名称不能为空').describe('菜单名称'),
  menuType: enumOf(MenuTypeEnumValues, '菜单类型枚举值不正确', '菜单类型不能为空').describe('菜单类型'),
  orderNum: z.coerce.number({ error: '菜单排序不能为空' }).int({ error: '菜单排序必须是整数' }).describe('菜单排序'),
  path: optionalText().describe('路由地址'),
  component: optionalText().describe('组件'),
  redirect: optionalText().describe('重定向'),
  icon: optionalText().describe('图标'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '是否可用枚举值不正确').describe('是否可用'),
  isFrame: optionalEnumOf(YesOrNoEnumValues, '是否外链枚举值不正确').describe('是否外链'),
  isCache: optionalEnumOf(YesOrNoEnumValues, '是否缓存枚举值不正确').describe('是否缓存'),
  isVisible: optionalEnumOf(YesOrNoEnumValues, '是否显示枚举值不正确').describe('是否显示'),
  remark: optionalText().describe('备注'),
}), { id: 'CreateSystemMenuReqDto' }))

export type CreateSystemMenuReqDto = z.infer<ReturnType<typeof createSystemMenuReqSchema>>

export const updateSystemMenuReqSchema = lazySchema(() => defineSchema(createSystemMenuReqSchema().extend({
  id: uuid('ID格式不正确').describe('ID'),
}), { id: 'UpdateSystemMenuReqDto' }))

export type UpdateSystemMenuReqDto = z.infer<ReturnType<typeof updateSystemMenuReqSchema>>
