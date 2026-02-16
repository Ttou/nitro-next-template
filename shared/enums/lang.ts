import { Enum } from 'enum-plus'

export const LangEnum = Enum({
  EN_US: { label: 'English', value: 'en_US' },
  ZH_CN: { label: '简体中文', value: 'zh_CN' },
} as const)

export const LangEnumMap = LangEnum.toMap({ keySelector: 'key', valueSelector: 'value' })

export const LangEnumValues = LangEnum.values

export type ILangEnum = typeof LangEnum.valueType
