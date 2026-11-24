import type { FieldValues } from 'plus-pro-components'

/**
 * 表单值转接口请求体
 *
 * `plus-form` 回传的字段类型是 `FieldValues`（`Record<keyof any, FieldValueType>`），
 * 既不含具体字段，类型也比 DTO 宽（`FieldValueType` 含 `boolean`/`Date`/`Dayjs` 等）。
 * 而接口请求体是由 OpenAPI 生成的强类型 DTO。表单必填项由 `rules` 保证，服务端由 zod
 * 兜底校验，因此这里只在提交边界做一次类型收口，不做任何运行时转换。
 *
 * @param values 表单值
 */
export function toPayload<T>(values: FieldValues): T {
  return values as unknown as T
}

/**
 * 空表单值
 *
 * 表单模型在弹窗打开前是空的，字段在 `showCreate`/`showUpdate` 里由 `Object.assign` 填充，
 * 但 `ref<T>({})` 会因为缺少必填字段报类型错误。用 `Partial<T>` 又会把字段变成
 * `T | undefined`，导致 `xxx.value.menuType` 之类的比较需要额外判空。
 * 这里保持 DTO 的完整类型，只把「初始为空」这件事收口到一处。
 */
export function emptyPayload<T>(): T {
  return {} as T
}
