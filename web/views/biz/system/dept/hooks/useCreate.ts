import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
  getDeptTree: () => Promise<void>
}

export function useCreate({ pageInstance, columns, getDeptTree }: UseCreateParams) {
  const createVisible = ref(false)
  const createValues = ref({})
  const createConfirmLoading = ref(false)

  const createDialogProps = computed<PlusDialogProps>(() => ({
    title: t('system.dept.dialog.create'),
    width: '700px',
    confirmLoading: unref(createConfirmLoading),
    destroyOnClose: true,
  }))

  const createFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    columns: unref(columns),
    rules: {
      deptName: [
        {
          required: true,
          message: t('common.validation.inputDeptName'),
          trigger: 'blur',
        },
      ],
      deptKey: [
        {
          required: true,
          message: t('common.validation.inputDeptKey'),
          trigger: 'blur',
        },
      ],
      isAvailable: [
        {
          required: true,
          message: t('common.validation.selectIsAvailable'),
          trigger: 'change',
        },
      ],
    },
  }))

  async function showCreate() {
    createVisible.value = true
    createConfirmLoading.value = true

    try {
      await getDeptTree()
      createConfirmLoading.value = false
    }
    catch (error) {
      createConfirmLoading.value = false
    }
  }

  async function confirmCreate(values: FieldValues) {
    try {
      createConfirmLoading.value = true

      await Apis.SystemDept.create({ data: values })

      createValues.value = Object.create({})
      createVisible.value = false
      createConfirmLoading.value = false

      ElNotification.success({
        title: t('common.title.notification'),
        message: t('common.message.createSuccess'),
      })

      pageInstance.value.getList()
    }
    catch (error) {
      createConfirmLoading.value = false
    }
  }

  return {
    createVisible,
    createValues,
    createDialogProps,
    createFormProps,
    showCreate,
    confirmCreate,
  }
}
