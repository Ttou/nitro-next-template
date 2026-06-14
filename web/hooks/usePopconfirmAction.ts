import type { ActionBarButtonsRow } from 'plus-pro-components'
import type { VNode } from 'vue'
import { Icon } from '@iconify/vue'
import { ElButton, ElPopover } from 'element-plus'
import { h, ref, render, shallowRef } from 'vue'

type IProps = ActionBarButtonsRow
interface IParams {
  text?: string | VNode
  message?: string | VNode
  cancelText?: string | VNode
  confirmText?: string | VNode
  onCancel?: (row: any, index: number, button: ActionBarButtonsRow) => void
  onConfirm?: (row: any, index: number, button: ActionBarButtonsRow) => Promise<void> | void
}

export function usePopconfirmAction(params?: IParams): IProps {
  return {
    text: params?.text ?? '删除',
    props: (row: any, index: number, button: ActionBarButtonsRow) => {
      const exposedRef = shallowRef()
      const confirmLoading = ref(false)

      function handleCancel() {
        params?.onCancel?.(row, index, button)
        exposedRef.value?.hide()
      }

      async function handleConfirm() {
        try {
          confirmLoading.value = true

          await params?.onConfirm?.(row, index, button)
          exposedRef.value?.hide()
        }
        finally {
          confirmLoading.value = false
        }
      }

      return {
        type: 'danger',
        onVnodeMounted(vnode: VNode) {
          render(h(ElPopover, {
            trigger: 'click',
            virtualRef: vnode.el,
            virtualTriggering: true,
            onVnodeBeforeMount(_vnode) {
              exposedRef.value = _vnode.component.exposed
            },
          }, {
            default: () => h('div', {
              class: 'el-popconfirm',
            }, {
              default: () => [
                h('div', { class: 'el-popconfirm__main' }, [
                  h(Icon, { class: 'el-popconfirm__icon', icon: 'ep:question-filled', color: 'rgb(255, 153, 0)' }),
                  h('span', params?.message ?? '确定删除吗？'),
                ]),
                h('div', { class: 'el-popconfirm__action' }, [
                  h(ElButton, { size: 'small', text: true, onClick: () => handleCancel() }, () => params?.cancelText ?? '取消'),
                  h(ElButton, { size: 'small', type: 'primary', loading: confirmLoading.value, onClick: () => handleConfirm() }, () => params?.confirmText ?? '确定'),
                ]),
              ],
            }),
          }), vnode.el as Element)
        },
      }
    },
  }
}
