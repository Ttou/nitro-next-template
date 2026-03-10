<script setup lang="ts">
import type { PlusHeaderProps, PlusSidebarProps } from 'plus-pro-components'
import type { RouteRecordRaw } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { cloneDeep, pick } from 'es-toolkit/compat'
import { match } from 'ts-pattern'
import { joinURL } from 'ufo'
import { computed, unref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppTabs, DarkToggle, LangSelect, UpdatePassword, UpdateProfile } from '~web/components'
import { useUserStore } from '~web/store'

defineOptions({
  name: 'DefaultLayout',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const plusLayoutRef = useTemplateRef('plusLayoutRef')
const updatePasswordRef = useTemplateRef('updatePasswordRef')
const updateProfileRef = useTemplateRef('updateProfileRef')

const filteredRoutes = computed(() => filterRoutes(cloneDeep(userStore.routes)))

const headerProps = computed<PlusHeaderProps>(() => {
  return {
    title: '后台管理',
    userInfo: {
      username: userStore.user?.nickName ?? userStore.user.userName,
    },
    dropdownList: [
      { label: '修改密码', value: 'password' },
      { label: '个人中心', value: 'profile' },
    ],
    onClickDropdownItem: (item: any) => {
      match(item.value as 'logout' | 'profile' | 'password')
        .with('logout', () => {
          ElMessageBox.confirm('确认退出登录？', {
            title: '提示',
            type: 'warning',
            beforeClose: (action, instance, done) => {
              match(action)
                .with('confirm', () => {
                  instance.confirmButtonLoading = true

                  userStore.logout().then(() => {
                    done()
                    instance.confirmButtonLoading = false
                    router.replace('/login')
                  })
                })
                .with('cancel', () => {
                  done()
                })
                .with('close', () => {
                  done()
                })
                .exhaustive()
            },
          })
            .then(() => {})
            .catch(() => {})
        })
        .with('profile', () => {
          updateProfileRef.value?.open()
        })
        .with('password', () => {
          updatePasswordRef.value?.open()
        })
        .exhaustive()
    },
  }
})

const sidebarProps = computed<PlusSidebarProps>(() => {
  return {
    routes: unref(filteredRoutes),
    defaultActive: route.path,
    onToggleCollapse: (collapse: boolean) => {
      if (!collapse) {
        // 展开时需要更新打开的路由
        plusLayoutRef.value?.plusSidebarInstance?.plusSidebarInstance?.updateActiveIndex(route.path)
      }
    },
  }
})

function filterRoutes(routes: RouteRecordRaw[], basePath = '/') {
  return routes
    .filter(v => v.meta?.hideInSidebar !== true)
    .map((v: any) => {
      if (v.children) {
        v.children = filterRoutes(v.children, v.path)

        if (v.meta?.onlyShowChildren) {
          return pick(v.children[0], ['path', 'meta', 'children'])
        }
      }
      v.path = joinURL(basePath, v.path)
      return pick(v, ['path', 'meta', 'children'])
    })
}
</script>

<template>
  <plus-layout
    ref="plusLayoutRef"
    :header-props="headerProps"
    :sidebar-props="sidebarProps"
    :has-breadcrumb="false"
  >
    <template #header-right>
      <div style="margin-right: 12px;">
        <el-space>
          <DarkToggle />
          <LangSelect />
        </el-space>
        <UpdatePassword ref="updatePasswordRef" />
        <UpdateProfile ref="updateProfileRef" />
      </div>
    </template>
    <template #layout-extra>
      <AppTabs />
    </template>
    <router-view v-slot="{ Component, route: routeItem }">
      <transition name="fade-slide" mode="out-in" appear>
        <component :is="Component" :key="routeItem.path" />
      </transition>
    </router-view>
  </plus-layout>
</template>
