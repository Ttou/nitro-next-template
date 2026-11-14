import type { PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import { ElNotification } from 'element-plus'
import { t } from '~web/i18n'

interface UseRemoveParams {
  pageInstance: Ref<PlusPageInstance>
}

export function useRemove({ pageInstance }: UseRemoveParams) {
  function confirmRemove(ids: string[]) {
    Apis.SystemDept.remove({
      data: { ids },
    })
      .then(() => {
        ElNotification.success({
          title: t('common.title.notification'),
          message: t('common.message.deleteSuccess'),
        })
        pageInstance.value?.getList()
      })
  }

  return {
    confirmRemove,
  }
}
