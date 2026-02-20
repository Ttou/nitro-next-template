import type { PlusDialogProps, PlusPageInstance, PlusPageProps } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { systemPostAuthApi } from '~web/apis'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  id: ComputedRef<string | number>
}

export function useCreate({ pageInstance, id }: UseCreateParams) {
  const createVisible = ref(false)
  const createConfirmLoading = ref(false)
  const createSelectedIds = ref<string[]>([])

  const createDialogProps = computed<PlusDialogProps>(() => ({
    title: '添加授权',
    width: '1200px',
    confirmLoading: unref(createConfirmLoading),
    destroyOnClose: true,
  }))
  const createPageProps = computed<PlusPageProps>(() => ({
    columns: [
      {
        label: '账号',
        prop: 'userName',
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '昵称',
        prop: 'nickName',
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '手机',
        prop: 'phone',
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '邮箱',
        prop: 'email',
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '是否可用',
        prop: 'isAvailable',
        valueType: 'select',
        options: YesOrNoEnum.items,
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
    ],
    search: {
      showNumber: 3,
    },
    table: {
      isSelection: true,
      onSelectionChange: (data: any[]) => {
        createSelectedIds.value = [...data].map(item => item.id)
      },
    },
    request: async (params) => {
      return await systemPostAuthApi.findUnallocatedUserPage({
        id: unref(id),
        ...params,
      })
    },
    searchCardProps: {
      shadow: 'never',
    },
    tableCardProps: {
      shadow: 'never',
    },
  }))

  function showCreate() {
    createVisible.value = true
  }

  async function confirmCreate() {
    if (createSelectedIds.value.length === 0) {
      ElMessage.error('请选择要授权的用户')
      return
    }

    try {
      createConfirmLoading.value = true

      await systemPostAuthApi.allocateUser({
        id: unref(id),
        ids: unref(createSelectedIds),
      })

      createConfirmLoading.value = false
      createVisible.value = false
      pageInstance.value.getList()
    }
    catch (error) {
      createConfirmLoading.value = false
    }
  }

  return {
    createVisible,
    createDialogProps,
    createPageProps,
    showCreate,
    confirmCreate,
  }
}
