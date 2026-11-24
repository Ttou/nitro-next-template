import type { PlusColumn, PlusDialogProps, PlusFormProps } from 'plus-pro-components'
import type { ComputedRef } from 'vue'
import { ElText } from 'element-plus'
import { omit } from 'es-toolkit'
import JsonEditorVue from 'json-editor-vue'
import { computed, h, ref, unref } from 'vue'
import { formatTime } from '~shared/utils'

interface UseDetailParams {
  columns: ComputedRef<PlusColumn[]>
}

export function useDetail({ columns }: UseDetailParams) {
  const detailVisible = ref(false)
  const detailValues = ref<Record<string, any>>({})

  const detailDialogProps = computed<PlusDialogProps>(() => ({
    title: '缓存详情',
    width: '1000px',
    hasFooter: false,
    destroyOnClose: true,
  }))

  const detailFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    columns: ([] as PlusColumn[]).concat(
      unref(columns).map((column) => {
        if (column.prop === 'key') {
          return {
            ...column,
            valueType: 'text',
            fieldProps: {
              type: 'info',
            },
          }
        }
        if (column.prop === 'ttl') {
          return {
            ...omit(column, ['valueType', 'fieldProps']),
            renderField(value) {
              return h(ElText, { type: 'warning' }, {
                default: () => formatTime(value as string | number),
              })
            },
          }
        }

        return column
      }) as PlusColumn[],
      [
        {
          label: '缓存键值',
          prop: 'value',
          renderField(value) {
            return h(JsonEditorVue, {
              mainMenuBar: false,
              statusbar: false,
              readOnly: true,
              value,
              style: 'width: 100%; max-height: 400px; overflow-y: auto;',
            })
          },
        },
      ] as PlusColumn[],
    ),
  }))

  function showDetail(params: any) {
    detailVisible.value = true
    Object.assign(detailValues.value, params)

    Apis.MonitorCache.findByKey({
      params: { cacheKey: params.key },
    }).then((res) => {
      detailValues.value.value = res
    })
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
