import type { PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { unref } from 'vue'
import { download } from '~web/utils'

interface UseExportParams {
  pageInstance: Ref<PlusPageInstance>
  selectedIds: Ref<string[]>
  dictType: ComputedRef<string>
}

export function useExport({ pageInstance, dictType }: UseExportParams) {
  function confirmExport() {
    ElMessageBox.confirm('确定要导出吗？', {
      type: 'warning',
      title: '提示',
    })
      .then(async () => {
        const searchParams = pageInstance.value.getSearchFieldsValue()

        const res = await Apis.SystemDictData.export({
          responseType: 'blob',
          data: {
            ...searchParams,
            dictType: unref(dictType),
          },
        })

        download(res)
      })
      .catch(() => {})
  }

  return {
    confirmExport,
  }
}
