import { z } from 'zod'

/**
 * 枚举对象的最小形状：能取到全部取值，能把取值转成标签
 */
interface IEnumLabelSource<T extends string> {
  values: readonly T[]
  label: (value: T) => string
}

/**
 * 枚举字段
 *
 * `z.enum` 要求字面量元组，而枚举库导出的是普通数组，这里统一收口类型转换
 *
 * @param values 允许的枚举值
 */
export function enumField<T extends string>(values: readonly T[]) {
  return z.enum(values as unknown as [T, ...T[]])
}

/**
 * 枚举标签字段
 *
 * 展示场景用（如导出表格）：把枚举值转换成标签文本
 *
 * @param enumObj 枚举对象，取值与标签都从它上面取
 */
export function enumLabelField<T extends string>(enumObj: IEnumLabelSource<T>) {
  return enumField(enumObj.values).transform(value => enumObj.label(value))
}

/**
 * 日期时间字段
 *
 * `Date` 在 JSON Schema 里没有对应类型，序列化后是 ISO 8601 字符串，
 * 因此按 `string` + `date-time` 输出（TS 侧仍是 `Date`）
 *
 * @param description 字段说明
 */
export function dateTimeField(description: string) {
  return z.date().describe(description).meta({
    override: { type: 'string', format: 'date-time' },
  })
}
