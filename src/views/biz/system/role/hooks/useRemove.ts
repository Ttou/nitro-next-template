import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  selectedIds: Ref<string[]>
}

export function useRemove({ pageInstance, selectedIds }: UseCreateParams) {
  function handleRemove(ids: string[]) {
    systemRoleApi.remove({ ids })
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
        }).catch(() => {})
    }
    else {
      handleRemove(ids)
    }
  }

  return {
    confirmRemove,
  }
}
