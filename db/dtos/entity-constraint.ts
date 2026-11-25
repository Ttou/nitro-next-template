import type { Collection } from '@mikro-orm/core'
import type { z } from 'zod'

/**
 * 实体上的关联字段
 *
 * DTO 约定「不含关联」，所以这些字段不参与约束；
 * 新增关联不会要求改 DTO，新增普通字段才会
 */
type RelationKeys<E> = {
  [K in keyof E]: E[K] extends Collection<any, any> ? K : never
}[keyof E]

/**
 * 实体上要求 DTO 覆盖的普通字段
 *
 * 用 `Extract<keyof E, string>` 过滤掉 MikroORM 的 `[PrimaryKeyProp]` 等内部符号
 */
export type EntityScalarKeys<E> = Exclude<Extract<keyof E, string>, RelationKeys<E>>

/**
 * 实体 DTO 的 schema 约束
 *
 * 用法：`export const sysXxxEntitySchema = z.object({...}).meta({...}) satisfies EntityDtoSchema<SysXxxEntity>`
 * 实体新增/改名字段而 DTO 没跟上时，编译期直接报错。
 * 允许 DTO 比实体多字段（例如 `userAgentParsed` 这种派生字段）
 */
export type EntityDtoSchema<E> = z.ZodObject<{
  [K in EntityScalarKeys<E>]: z.ZodType<E[K]>
}>
