import type { App } from 'vue'
import VxeUIPluginRenderElement from '@vxe-ui/plugin-render-element'
import VxeUIBase, { VxeUI } from 'vxe-pc-ui'
import VxeUITable from 'vxe-table'
import 'vxe-pc-ui/lib/style.css'
import 'vxe-table/lib/style.css'
import '@vxe-ui/plugin-render-element/dist/style.css'

export function useVxeTable(app: App) {
  VxeUI.use(VxeUIPluginRenderElement)

  VxeUI.setConfig({
    size: 'default',
  })

  app.use(VxeUIBase).use(VxeUITable)
}
