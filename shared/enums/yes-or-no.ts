import { Enum } from 'enum-plus'

export const YesOrNoEnum = Enum({
  NO: { label: '否', value: '0' },
  YES: { label: '是', value: '1' },
} as const)

export const YesOrNoEnumMap = YesOrNoEnum.toMap({ keySelector: 'key', valueSelector: 'value' })

export const YesOrNoEnumValues = YesOrNoEnum.values

export type IYesOrNoEnum = typeof YesOrNoEnum.valueType
