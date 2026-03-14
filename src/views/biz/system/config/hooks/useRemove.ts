import type { PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

interface UseRemoveParams {
  pageInstance: Ref<PlusPageInstance>
  selectedIds: Ref<string[]>
}

export function useRemove({ pageInstance, selectedIds }: UseRemoveParams) {
  function handleRemove(ids: string[]) {
    Apis.SystemConfig.remove({ data: { ids } })
      .then(() => {
        ElNotification.success({ title: '通知', message: '删除成功' })
        pageInstance.value.getList()
      })
  }

  function confirmRemove(ids: string[], batch: boolean = false) {
    if (batch) {
      if (!selectedIds.value.length) {
        ElMessage.warning('请选择要删除的数据')
        return
      }

      ElMessageBox.confirm('确定删除选中的数据吗？', {
        type: 'warning',
        title: '提示',
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

  return {
    confirmRemove,
  }
}
