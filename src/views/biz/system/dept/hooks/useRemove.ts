import type { PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import { ElNotification } from 'element-plus'

interface UseRemoveParams {
  pageInstance: Ref<PlusPageInstance>
}

export function useRemove({ pageInstance }: UseRemoveParams) {
  function confirmRemove(ids: string[]) {
    Apis.SystemDept.remove({ data: { ids } })
      .then(() => {
        ElNotification.success({ title: '通知', message: '删除成功' })
        pageInstance.value?.getList()
      })
  }

  return {
    confirmRemove,
  }
}
