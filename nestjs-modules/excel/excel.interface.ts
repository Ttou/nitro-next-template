import type { AddWorksheetOptions, Column } from '@cj-tech-master/excelts'
import type { ConfigurableModuleOptionsFactory } from '@nestjs/common'
import type { z } from 'zod'

/**
 * 表格文件配置
 */
export interface IExcelFileOptions {
  /**
   * 文件名
   */
  fileName?: string
  /**
   * 工作表名
   */
  sheetName?: string
  /**
   * 工作表配置
   */
  sheetOptions?: AddWorksheetOptions
}

/**
 * 表格列附加配置
 *
 * 按字段名声明 `key`、`header` 之外的列属性（列宽、样式等），
 * `key` 与 `header` 由 schema 推导，无需重复声明
 */
export type IExcelColumnsOptions = Record<string, Column['defn']>

/**
 * 表格定义
 *
 * 列顺序取自 schema 的字段顺序，表头取自字段的 `describe()`
 */
export interface IExcelDefinition<S extends z.ZodObject = z.ZodObject> extends IExcelFileOptions {
  /**
   * 列 schema
   */
  schema: S
  /**
   * 列附加配置
   */
  columns?: IExcelColumnsOptions
}

export interface ExcelModuleOptions {
  /**
   * 默认工作表名
   */
  defaultSheetName?: string | (() => string)
  /**
   * 默认文件名
   */
  defaultFileName?: string | (() => string)
}

export interface ExcelModuleOptionsFactory extends ConfigurableModuleOptionsFactory<ExcelModuleOptions, 'createExcelOptions'> {}
