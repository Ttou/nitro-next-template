import { Column } from '@cj-tech-master/excelts'

export interface ExcelModuleOptions {}

export interface IExcelFileOptions {
  fileName?: string
  sheetName?: string
  timestamp?: boolean
}

export type IExcelColumnOptions = Column['defn']
