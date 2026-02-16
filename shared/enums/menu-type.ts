import { Enum } from 'enum-plus'

export const MenuTypeEnum = Enum({
  MENU: { label: '菜单', value: 'C' },
  BUTTON: { label: '按钮', value: 'F' },
  FOLDER: { label: '目录', value: 'M' },
} as const)

export const MenuTypeEnumMap = MenuTypeEnum.toMap({ keySelector: 'key', valueSelector: 'value' })

export const MenuTypeEnumValues = MenuTypeEnum.values

export type IMenuTypeEnum = typeof MenuTypeEnum.valueType
