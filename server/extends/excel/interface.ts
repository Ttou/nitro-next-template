import type { AddWorksheetOptions } from '@cj-tech-master/excelts'
import { Column } from '@cj-tech-master/excelts'

export interface ExcelModuleOptions {}

export interface IExcelFileOptions {
  fileName?: string
  sheetName?: string
  sheetOptions?: AddWorksheetOptions
}

export type IExcelColumnOptions = Column['defn']
