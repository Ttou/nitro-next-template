import type { RouteRecordRaw } from 'vue-router'
import type { LoginReqDto } from '~web/apis/globals'
import { uniqBy } from 'es-toolkit'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MenuTypeEnum } from '~shared/enums'

import { createMenus, listToTree } from '~web/utils'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref()
    const token = ref('')
    const routes = ref<RouteRecordRaw[]>([])
    const permissions = ref<string[]>([])
    const infoRequested = ref(false)
    const homePath = ref<string>('')

    async function login(data: LoginReqDto) {
      const result = await Apis.Auth.login({ data })

      token.value = result
    }

    async function logout() {
      await Apis.Auth.logout()

      await clear()
    }

    async function getInfo() {
      const result = await Apis.CurrentUser.getInfo()

      const { roles, ...restInfo } = result

      const total = uniqBy(roles.map(role => role.menus).flat(1), menu => menu.id)
      const _menus = total.filter(menu => menu.menuType !== MenuTypeEnum.BUTTON)
      const _permissions = total.filter(menu => menu.menuType === MenuTypeEnum.BUTTON).map(menu => menu.menuKey)

      permissions.value = _permissions

      const menus = await createMenus(listToTree(_menus))

      // 首页地址默认取菜单第一个
      homePath.value = menus[0].redirect || menus[0].path

      menus.push(
        {
          path: '/',
          redirect: homePath.value,
          meta: { hideInSidebar: true },
        },
        {
          path: '/:pathMatch(.*)*',
          meta: { hideInSidebar: true },
          redirect: {
            path: '/error',
            query: { status: 404 },
          },
        },
      )

      routes.value = menus
      infoRequested.value = true
      user.value = restInfo

      return menus
    }

    async function clear() {
      token.value = ''
    }

    return {
      user,
      token,
      routes,
      permissions,
      infoRequested,
      homePath,
      login,
      logout,
      clear,
      getInfo,
    }
  },
  {
    persist: {
      pick: ['token', 'permissions'],
    },
  },
)
