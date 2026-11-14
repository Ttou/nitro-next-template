import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import type { CreateSystemConfigReqDto } from '~web/apis/globals'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
}

export function useCreate({ pageInstance, columns }: UseCreateParams) {
  const createVisible = ref(false)
  const createValues = ref<CreateSystemConfigReqDto>({})
  const createConfirmLoading = ref(false)

  const createDialogProps = computed<PlusDialogProps>(() => ({
    title: t('system.config.dialog.create'),
    width: '700px',
    confirmLoading: unref(createConfirmLoading),
    destroyOnClose: true,
  }))

  const createFormProps = computed<PlusFormProps>(() => ({
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

  function showCreate() {
    createVisible.value = true
  }

  async function confirmCreate(values: FieldValues) {
    try {
      createConfirmLoading.value = true

      await Apis.SystemConfig.create({ data: values })

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
