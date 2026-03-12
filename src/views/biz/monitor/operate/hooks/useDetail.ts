import type { PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import type { FindMonitorOperatePageResDto } from '~web/apis'
import { ElText } from 'element-plus'
import { omit } from 'es-toolkit'
import { computed, h, ref, unref } from 'vue'
import { formatTime } from '~shared/utils'

interface UseDetailParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
}

export function useDetail({ pageInstance, columns }: UseDetailParams) {
  const detailVisible = ref(false)
  const detailValues = ref<FindMonitorOperatePageResDto['data'][number]>({})

  const detailDialogProps = computed<PlusDialogProps>(() => ({
    title: '操作详情',
    width: '1000px',
    hasFooter: false,
    destroyOnClose: true,
  }))

  const detailFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    colProps: {
      span: 12,
    },
    columns: unref(columns).map((column) => {
      if (['user.userName', 'user.nickName'].includes(column.prop)) {
        return {
          ...column,
          valueType: 'text',
          fieldProps: {
            type: 'info',
          },
        }
      }
      if (column.prop === 'operateTime') {
        return {
          ...omit(column, ['valueType', 'fieldProps']),
          colProps: {
            span: 24,
          },
          renderField(value, onChange, props) {
            return h(ElText, { type: 'primary' }, { default: () => formatTime(value) })
          },
        }
      }
      return column
    }),
  }))

  function showDetail(params: any) {
    Object.assign(detailValues.value, params)
    detailVisible.value = true
  }

  function closeDetail() {
    detailValues.value = Object.create({})
  }

  return {
    detailVisible,
    detailValues,
    detailDialogProps,
    detailFormProps,
    showDetail,
    closeDetail,
  }
}
