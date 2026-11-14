import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import type { UpdateSystemConfigReqDto } from '~web/apis/globals'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'

interface UseUpdateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
}

export function useUpdate({ pageInstance, columns }: UseUpdateParams) {
  const updateVisible = ref(false)
  const updateValues = ref<UpdateSystemConfigReqDto>({})
  const updateConfirmLoading = ref(false)

  const updateDialogProps = computed<PlusDialogProps>(() => ({
    title: t('system.config.dialog.update'),
    width: '700px',
    confirmLoading: unref(updateConfirmLoading),
    destroyOnClose: true,
  }))

  const updateFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    columns: unref(columns),
    rules: {
      configName: [
        {
          required: true,
          message: t('common.validation.inputConfigName'),
          trigger: 'blur',
        },
      ],
      configKey: [
        {
          required: true,
          message: t('common.validation.inputConfigKey'),
          trigger: 'blur',
        },
      ],
      configValue: [
        {
          required: true,
          message: t('common.validation.inputConfigValue'),
          trigger: 'blur',
        },
      ],
      isBuiltin: [
        {
          required: true,
          message: t('common.validation.selectIsBuiltin'),
          trigger: 'change',
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

      await Apis.SystemConfig.update({ data: values })

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
