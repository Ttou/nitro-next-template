import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'

interface UseUpdateParams {
  pageInstance: Ref<PlusPageInstance>
  dictType: ComputedRef<string>
  columns: ComputedRef<PlusColumn[]>
}

export function useUpdate({ pageInstance, dictType, columns }: UseUpdateParams) {
  const updateVisible = ref(false)
  const updateValues = ref({})
  const updateConfirmLoading = ref(false)

  const updateDialogProps = computed<PlusDialogProps>(() => ({
    title: t('system.dictData.dialog.update'),
    width: '700px',
    confirmLoading: unref(updateConfirmLoading),
    destroyOnClose: true,
  }))

  const updateFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    columns: unref(columns),
    rules: {
      dictLabel: [
        {
          required: true,
          message: t('common.validation.inputDictLabel'),
          trigger: 'blur',
        },
      ],
      dictValue: [
        {
          required: true,
          message: t('common.validation.inputDictValue'),
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

  function showUpdate(params) {
    Object.assign(updateValues.value, params)
    updateVisible.value = true
  }

  async function confirmUpdate(values: FieldValues) {
    try {
      updateConfirmLoading.value = true

      await Apis.SystemDictData.update({
        data: {
          ...values,
          dictType: unref(dictType),
        },
      })

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
