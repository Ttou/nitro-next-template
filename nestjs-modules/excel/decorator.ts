import type { IExcelColumnOptions, IExcelFileOptions } from './interface'
import { applyDecorators } from '@nestjs/common'
import { Expose } from 'class-transformer'

/**
 * 表格文件装饰器标识
 */
export const EXCEL_FILE_METADATA = 'excel:file'

export function ExcelFile(options?: IExcelFileOptions) {
  return applyDecorators(
    Reflect.metadata(EXCEL_FILE_METADATA, options),
  )
}

/**
 * 表格列装饰器标识
 */
export const EXCEL_COLUMN_METADATA = 'excel:column'
/**
 * 表格列序列化群组名
 */
export const EXCEL_COLUMN_EXPOSE = 'excel:column:expose'

export function ExcelColumn(options?: IExcelColumnOptions) {
  return applyDecorators(
    Reflect.metadata(EXCEL_COLUMN_METADATA, options),
    Expose({ groups: [EXCEL_COLUMN_EXPOSE] }),
  )
}
