import type { ExcelModuleOptions } from './interface'

export const defaultOptions: ExcelModuleOptions = {
  defaultSheetName: 'Sheet1',
  defaultFileName: () => `${Date.now()}.xlsx`,
}
