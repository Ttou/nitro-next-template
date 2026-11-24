import type { PlusColumn, PlusDialogProps, PlusFormProps } from 'plus-pro-components'
import type { ComputedRef } from 'vue'
import type { SysLoginLogEntityDto } from '~web/apis/globals'
import { ElTag, ElText } from 'element-plus'
import { omit } from 'es-toolkit'
import { computed, h, ref, unref } from 'vue'
import { formatTime } from '~shared/utils'

interface UseDetailParams {
  columns: ComputedRef<PlusColumn[]>
}

export function useDetail({ columns }: UseDetailParams) {
  const detailVisible = ref(false)
  const detailValues = ref<Partial<SysLoginLogEntityDto>>({})

  const detailDialogProps = computed<PlusDialogProps>(() => ({
    title: '登录详情',
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
      if (column.prop === 'userName') {
        return {
          ...column,
          valueType: 'text',
          fieldProps: {
            type: 'info',
          },
        }
      }
      if (column.prop === 'status') {
        return {
          ...omit(column, ['valueType', 'fieldProps']),
          renderField(value) {
            return h(ElTag, {
              type: value === 200
                ? 'success'
                : 'danger',
            }, {
              default: () => value,
            })
          },
        }
      }
      if (column.prop === 'operateTime') {
        return {
          ...omit(column, ['valueType', 'fieldProps']),
          renderField(value) {
            return h(ElText, { type: 'primary' }, {
              default: () => formatTime(value as string | number),
            })
          },
        }
      }
      return column
    }) as PlusColumn[],
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
