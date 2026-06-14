import { Icon } from '@iconify/vue'
import { pascalCase } from 'es-toolkit'
import { h } from 'vue'
import { YesOrNoEnum } from '~shared/enums'
import { DefaultLayout } from '~web/layouts'

const routeComponents = import.meta.glob(`../views/**/index.{jsx,tsx,vue}`)
function loadComponent(component: string) {
  return ['vue']
    .map(v => routeComponents[`../views/biz/${component}/index.${v}`])
    .find(v => !!v)
}

export async function createMenus(menus: any[]) {
  const res: any[] = []

  for (const menu of menus) {
    const temp = { ...menu }

    temp.meta = {
      hideInSidebar: temp.isVisible === YesOrNoEnum.NO,
      title: temp.menuName,
      icon: temp.icon ? () => h(Icon, { icon: temp.icon }) : null,
    }
    temp.name = pascalCase(menu.menuKey)

    if (menu.parentId === null) {
      temp.component = DefaultLayout
    }
    else if (menu.component === null) {
      // 新的 vue-router 已经不需要设置二级菜单的组件了
    }
    else {
      const component = loadComponent(menu.component)!

      if (component) {
        const module: any = await component()

        temp.component = component
        temp.meta.noCache = temp.isCache === YesOrNoEnum.YES

        // 设置异步组件名称以支持缓存
        module.default.name = temp.name
      }
      else {
        console.warn('配置的页面不存在：', menu.component)
      }
    }

    if (temp.children) {
      temp.children = await createMenus(temp.children)
    }

    res.push(temp)
  }

  return res
}
