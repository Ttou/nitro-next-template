import type { Plugin } from 'vite'
import type { VitePluginEjsHtmlOptions } from './interface'
import fs from 'node:fs'
import ejs from 'ejs'

/**
 * VitePluginEjsHtml
 * @description使用EJS向index.html注入变量
 */
export function VitePluginEjsHtml(options: VitePluginEjsHtmlOptions = {}): Plugin {
  const { data = {}, template } = options

  return {
    name: 'vite-plugin-ejs-html',
    enforce: 'pre',

    transformIndexHtml(html) {
      return new Promise((resolve, reject) => {
        // 如果指定了模板文件，使用模板文件
        try {
          let content = html
          if (template) {
            content = fs.readFileSync(template, 'utf-8')
          }

          ejs.render(content, data, { async: true }).then(resolve).catch(reject)
        }
        catch (error) {
          reject(error)
        }
      })
    },
  }
}
