import type { z } from 'zod'
import type { IExcelDefinition } from './excel.interface'

/**
 * 定义表格
 *
 * 列的顺序、表头与展示转换都由 zod schema 承担：
 * 字段顺序即列顺序，`describe()` 即表头，字段上的 `transform` 在导出时生效（如枚举值转标签）
 */
export function defineExcel<S extends z.ZodObject>(definition: IExcelDefinition<S>): IExcelDefinition<S> {
  return definition
}
