import { z } from 'zod'

/**
 * schema 元数据
 *
 * `id` 为 OpenAPI 组件名，必填且全局唯一；其余字段原样透传给 zod 的 `.meta()`
 */
export interface SchemaMeta {
  /** 组件名，同时作为注册表的键 */
  id: string
  /** 标题 */
  title?: string
  /** 说明，对应 OpenAPI 的 description */
  description?: string
  /** 单值示例 */
  example?: unknown
  /** 多值示例 */
  examples?: unknown[]
  /** 是否已废弃 */
  deprecated?: boolean
  /** 透传 zod-openapi 的扩展字段，如 `override`、`default` */
  [key: string]: unknown
}

/**
 * schema 注册表：组件名 -> schema
 *
 * 懒加载：首次写入或读取时才创建，纯类型导入场景不产生额外分配
 */
let registry: Map<string, z.ZodType> | undefined

function getRegistry() {
  return (registry ??= new Map())
}

/**
 * OpenAPI 组件名格式：字母开头，仅含字母、数字、下划线、点、短横线
 */
const COMPONENT_ID_PATTERN = /^[A-Z][\w.-]*$/i

/**
 * 定义并注册 schema
 *
 * 统一收口三件事：
 * 1. 写入 `id` 等元数据，供 OpenAPI 生成组件
 * 2. 注册到本地注册表，可按 id 反查
 * 3. 类型不变，`z.infer<typeof schema>` 的推断结果不受影响
 *
 * 注意 zod 的 `.meta()` 会克隆出新实例，因此注册并返回的是克隆后的 schema
 *
 * @param schema zod schema
 * @param meta 元数据，`id` 必填
 * @returns 写入了元数据的 schema（类型与入参一致）
 *
 * @example
 * ```ts
 * export const loginReqSchema = defineSchema(
 *   z.object({ userName: z.string() }),
 *   { id: 'LoginReqDto', description: '登录请求' },
 * )
 * export type LoginReqDto = z.infer<typeof loginReqSchema>
 * ```
 */
export function defineSchema<T extends z.ZodType>(schema: T, meta: SchemaMeta): T {
  const { id, ...rest } = meta

  if (!COMPONENT_ID_PATTERN.test(id)) {
    throw new Error(
      `[defineSchema] 非法的组件名 "${id}"，需以字母开头，且只含字母、数字、下划线、点或短横线`,
    )
  }

  const map = getRegistry()
  const registered = map.get(id)
  if (registered && registered !== schema) {
    throw new Error(`[defineSchema] 组件名 "${id}" 已被注册，请保证全局唯一`)
  }

  const defined = schema.meta({ ...rest, id })
  map.set(id, defined)

  return defined
}

/**
 * 懒加载 schema 工厂
 *
 * 模块顶层只创建闭包，schema 在首次调用时才构建（并注册）；
 * 未被引用的 DTO 模块因此没有任何顶层求值，打包时可被完整摇除
 */
/* @__NO_SIDE_EFFECTS__ */
export function lazySchema<T>(build: () => T): () => T {
  let cached: T | undefined
  return () => (cached ??= build())
}

/**
 * 按组件名取 schema
 */
export function getSchema(id: string): z.ZodType | undefined {
  return registry?.get(id)
}

/**
 * 组件名是否已注册
 */
export function hasSchema(id: string): boolean {
  return registry?.has(id) ?? false
}

/**
 * 全部已注册的 schema（只读视图）
 */
export function getSchemaRegistry(): ReadonlyMap<string, z.ZodType> {
  return getRegistry()
}

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
