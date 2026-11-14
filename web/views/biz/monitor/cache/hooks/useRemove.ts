import type { PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { t } from '~web/i18n'

interface UseRemoveParams {
  pageInstance: Ref<PlusPageInstance>
  selectedIds: Ref<string[]>
}

export function useRemove({ pageInstance, selectedIds }: UseRemoveParams) {
  function handleRemove(keys: string[]) {
    Apis.MonitorCache.remove({
      data: { keys },
    })
      .then(() => {
        ElNotification.success({
          title: t('common.title.notification'),
          message: t('common.message.deleteSuccess'),
        })
        pageInstance.value.getList()
      })
  }

  function confirmRemove(ids: string[], batch: boolean = false) {
    if (batch) {
      if (!selectedIds.value.length) {
        ElMessage.warning(t('common.message.selectDataToDelete'))
        return
      }

      ElMessageBox.confirm(t('common.confirm.deleteSelected'), {
        type: 'warning',
        title: t('common.title.tip'),
      })
        .then(() => {
          handleRemove(ids)
        })
        .catch(() => {})
    }
    else {
      handleRemove(ids)
    }
  }

  function confirmClear() {
    ElMessageBox.confirm(t('monitor.cache.confirm.clear'), {
      type: 'warning',
      title: t('common.title.tip'),
    })
      .then(() => {
        Apis.MonitorCache.clear()
          .then(() => {
            ElNotification.success({
              title: t('common.title.notification'),
              message: t('monitor.cache.message.clearSuccess'),
            })
            pageInstance.value.getList()
          })
      })
      .catch(() => {})
  }

  return {
    confirmRemove,
    confirmClear,
  }
}
