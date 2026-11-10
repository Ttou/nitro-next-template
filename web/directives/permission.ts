import type { Directive, ShallowRef } from 'vue'
import type { IPermissionEnum } from '~shared/enums'
import { shallowRef, watchEffect } from 'vue'
import { useUserStore } from '~web/store'

/** 单个权限标识或权限数组，取值来自 shared/enums/permission.ts 的 PermissionEnum */
export type PermissionValue = IPermissionEnum | IPermissionEnum[]
export type PermissionMode = 'every' | 'some'

/**
 * 判断当前用户是否拥有指定接口权限。
 *
 * 权限值来自 useUserStore.permissions（后端返回的按钮类型 menuKey），
 * 与 PermissionEnum 以及服务端 @XltCheckPermission 装饰器同源。
 * 在 computed 中调用时会自动跟随权限变化重新计算。
 */
export function hasPermission(value: PermissionValue, mode: PermissionMode = 'every'): boolean {
  // 必须保留 store 引用：解构会丢失 Pinia setup store 的响应式，
  // 导致 computed / watchEffect 无法追踪到权限异步加载或清空后的变化。
  const store = useUserStore()
  const keys = Array.isArray(value)
    ? value
    : [value]

  if (keys.length === 0) {
    return true
  }

  return mode === 'some'
    ? keys.some(key => store.permissions.includes(key))
    : keys.every(key => store.permissions.includes(key))
}

interface PermissionState {
  value: ShallowRef<PermissionValue>
  mode: ShallowRef<PermissionMode>
  stop: () => void
}

const states = new WeakMap<HTMLElement, PermissionState>()

function resolveMode(arg: string | undefined): PermissionMode {
  return arg === 'some'
    ? 'some'
    : 'every'
}

/**
 * 按钮级权限指令，无权限时隐藏元素（保留 DOM，权限变化后可自动恢复）。
 *
 * @example
 * ```vue
 * <el-button v-permission="PermissionEnum.SYSTEM_USER_CREATE">添加</el-button>
 * <el-button v-permission="[PermissionEnum.SYSTEM_USER_UPDATE]">编辑</el-button>
 * <el-button v-permission:some="[PermissionEnum.A, PermissionEnum.B]">任一即可</el-button>
 * ```
 */
export const permissionDirective: Directive<HTMLElement, PermissionValue> = {
  mounted(el, binding) {
    const value = shallowRef(binding.value)
    const mode = shallowRef<PermissionMode>(resolveMode(binding.arg))
    const originalDisplay = el.style.display

    const stop = watchEffect(() => {
      el.style.display = hasPermission(value.value, mode.value)
        ? originalDisplay
        : 'none'
    })

    states.set(el, { value, mode, stop })
  },

  updated(el, binding) {
    const state = states.get(el)

    if (!state) {
      return
    }

    state.value.value = binding.value
    state.mode.value = resolveMode(binding.arg)
  },

  unmounted(el) {
    states.get(el)?.stop()
    states.delete(el)
  },
}
