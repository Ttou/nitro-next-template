import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 路由标题，用于标签页、面包屑 */
    title?: string
    /** 不在侧边栏展示 */
    hideInSidebar?: boolean
  }
}
