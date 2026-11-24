import type { PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import { useTemplateRef } from 'vue'

/**
 * plus-page 的模板 ref。
 *
 * `useTemplateRef` 的返回类型是 `Readonly<ShallowRef<PlusPageInstance | null>>`，
 * 而各页面的 hook 统一按 `Ref<PlusPageInstance>` 收参、只在事件回调里取用
 * （此时组件必然已挂载），所以在这里收口一次，避免每个调用点各写一遍断言。
 */
export function usePageInstance() {
  return useTemplateRef<PlusPageInstance>('pageInstance') as unknown as Ref<PlusPageInstance>
}
