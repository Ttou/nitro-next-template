import type { AddWorksheetOptions } from '@cj-tech-master/excelts'
import type { ClassTransformOptions } from 'class-transformer'
import { Column } from '@cj-tech-master/excelts'

export interface ExcelModuleOptions {}

export interface IExcelFileOptions {
  fileName?: string
  sheetName?: string
  sheetOptions?: AddWorksheetOptions
  transformOptions?: ClassTransformOptions
}

export type IExcelColumnOptions = Column['defn']
