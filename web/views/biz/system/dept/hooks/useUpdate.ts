import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'

interface UseUpdateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
  getDeptTree: () => Promise<void>
}

export function useUpdate({ pageInstance, columns, getDeptTree }: UseUpdateParams) {
  const updateVisible = ref(false)
  const updateValues = ref({})
  const updateConfirmLoading = ref(false)

  const updateDialogProps = computed<PlusDialogProps>(() => ({
    title: t('system.dept.dialog.update'),
    width: '700px',
    confirmLoading: unref(updateConfirmLoading),
    destroyOnClose: true,
  }))

  const updateFormProps = computed<PlusFormProps>(() => ({
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

  async function showUpdate(params) {
    Object.assign(updateValues.value, params)
    updateVisible.value = true

    updateConfirmLoading.value = true

    try {
      await getDeptTree()
      updateConfirmLoading.value = false
    }
    catch (error) {
      updateConfirmLoading.value = false
    }
  }

  async function confirmUpdate(values: FieldValues) {
    try {
      updateConfirmLoading.value = true

      await Apis.SystemDept.update({ data: values })

      updateValues.value = Object.create({})
      updateVisible.value = false
      updateConfirmLoading.value = false

      ElNotification.success({
        title: t('common.title.notification'),
        message: t('common.message.updateSuccess'),
      })

      pageInstance.value.getList()
    }
    catch (error) {
      updateConfirmLoading.value = false
    }
  }

  return {
    updateVisible,
    updateValues,
    updateDialogProps,
    updateFormProps,
    showUpdate,
    confirmUpdate,
  }
}
