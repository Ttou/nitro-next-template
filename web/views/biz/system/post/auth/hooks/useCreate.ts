import type { PlusDialogProps, PlusPageInstance, PlusPageProps } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  id: ComputedRef<string | number>
}

export function useCreate({ pageInstance, id }: UseCreateParams) {
  const createVisible = ref(false)
  const createConfirmLoading = ref(false)
  const createSelectedIds = ref<string[]>([])

  const createDialogProps = computed<PlusDialogProps>(() => ({
    title: t('system.auth.button.grant'),
    width: '1200px',
    confirmLoading: unref(createConfirmLoading),
    destroyOnClose: true,
  }))
  const createPageProps = computed<PlusPageProps>(() => ({
    columns: [
      {
        label: t('common.field.account'),
        prop: 'userName',
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: t('common.field.nickname'),
        prop: 'nickName',
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: t('common.field.phone'),
        prop: 'phone',
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: t('common.field.email'),
        prop: 'email',
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: t('common.field.isAvailable'),
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
        createSelectedIds.value = Array.from(data, item => item.id)
      },
    },
    request: async (params) => {
      return await Apis.SystemPostAuth.findUnallocatedUserPage({
        data: {
          id: unref(id),
          ...params,
        },
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
      ElMessage.error(t('system.auth.message.selectUserToGrant'))
      return
    }

    try {
      createConfirmLoading.value = true

      await Apis.SystemPostAuth.allocateUser({
        data: {
          id: unref(id),
          ids: unref(createSelectedIds),
        },
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
