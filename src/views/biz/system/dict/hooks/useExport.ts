import type { PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { systemDictTypeApi } from '~web/apis'
import { download } from '~web/utils'

interface UseExportParams {
  pageInstance: Ref<PlusPageInstance>
  selectedIds: Ref<string[]>
}

export function useExport({ pageInstance }: UseExportParams) {
  function confirmExport() {
    ElMessageBox.confirm('确定要导出吗？', {
      type: 'warning',
      title: '提示',
    })
      .then(async () => {
        const searchParams = pageInstance.value.getSearchFieldsValue()
        const pageParams = pageInstance.value.plusTableInstance?.$props.pagination?.modelValue

        const res = await systemDictTypeApi.export({
          ...searchParams,
          ...pageParams,
        })

        download(res)
      })
      .catch(() => {})
  }

  return {
    confirmExport,
  }
}
