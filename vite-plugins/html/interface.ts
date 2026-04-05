import type { Data } from 'ejs'

export interface VitePluginEjsHtmlOptions {
  /**
   * EJS模板数据
   */
  data?: Data
  /**
   * 自定义模板路径（可选）
   */
  template?: string
}
