import type { PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { t } from '~web/i18n'
import { download } from '~web/utils'

interface UseExportParams {
  pageInstance: Ref<PlusPageInstance>
  selectedIds: Ref<string[]>
}

export function useExport({ pageInstance }: UseExportParams) {
  function confirmExport() {
    ElMessageBox.confirm(t('common.confirm.export'), {
      type: 'warning',
      title: t('common.title.tip'),
    })
      .then(async () => {
        const searchParams = pageInstance.value.getSearchFieldsValue()
        const pageParams = pageInstance.value.plusTableInstance?.$props.pagination?.modelValue

        const res = await Apis.SystemRole.export({
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
