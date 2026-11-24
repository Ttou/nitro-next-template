import type { PageInfo, PlusPageInstance } from 'plus-pro-components'

/** 未开启分页时的兜底值，与服务端 `pageReqSchema` 的默认值保持一致 */
const defaultPageParams: PageInfo = { page: 1, pageSize: 20 }

/**
 * 取 plus-page 的搜索表单值
 *
 * `getSearchFieldsValue()` 声明返回 `FieldValueType`，而该类型含 `string`/`number`/
 * `boolean` 等非对象成员，直接展开到请求体会报「Spread types may only be created
 * from object types」。运行时它始终是搜索表单的字段对象，因此在边界处收口。
 *
 * @param pageInstance plus-page 实例
 */
export function getSearchParams(pageInstance: PlusPageInstance) {
  return pageInstance.getSearchFieldsValue() as Record<string, any>
}

/**
 * 取 plus-page 当前的分页参数
 *
 * `$props.pagination` 的类型是 `false | Partial<PlusPaginationProps>`（未开启分页时为
 * `false`），其 `modelValue` 也可空。而导出接口复用了分页查询的 schema，`page`/`pageSize`
 * 是必填项，缺失会被服务端校验拦下，因此这里始终返回完整的分页参数。
 *
 * @param pageInstance plus-page 实例
 */
export function getPageParams(pageInstance: PlusPageInstance): PageInfo {
  const pagination = pageInstance.plusTableInstance?.$props.pagination

  return (pagination ? pagination.modelValue : undefined) ?? defaultPageParams
}
