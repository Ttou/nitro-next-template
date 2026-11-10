import type { App } from 'vue'
import { permissionDirective } from './permission'

export * from './permission'

/** 注册全局指令 */
export function setupDirectives(app: App) {
  app.directive('permission', permissionDirective)
}
