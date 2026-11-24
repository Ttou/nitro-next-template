import type { PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { download, getPageParams, getSearchParams } from '~web/utils'

interface UseExportParams {
  pageInstance: Ref<PlusPageInstance>
}

export function useExport({ pageInstance }: UseExportParams) {
  function confirmExport() {
    ElMessageBox.confirm('确定要导出吗？', {
      type: 'warning',
      title: '提示',
    })
      .then(async () => {
        const searchParams = getSearchParams(pageInstance.value)
        const pageParams = getPageParams(pageInstance.value)

        const res = await Apis.SystemDictType.export({
          responseType: 'blob',
          data: {
            ...searchParams,
            ...pageParams,
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
