import type { AddWorksheetOptions, Column } from '@cj-tech-master/excelts'
import type { ConfigurableModuleOptionsFactory } from '@nestjs/common'

export interface IExcelFileOptions {
  fileName?: string
  sheetName?: string
  sheetOptions?: AddWorksheetOptions
}

export type IExcelColumnOptions = Column['defn']

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
