import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  dictType: ComputedRef<string>
  columns: ComputedRef<PlusColumn[]>
}

export function useCreate({ pageInstance, dictType, columns }: UseCreateParams) {
  const createVisible = ref(false)
  const createValues = ref({})
  const createConfirmLoading = ref(false)

  const createDialogProps = computed<PlusDialogProps>(() => ({
    title: t('system.dictData.dialog.create'),
    width: '700px',
    confirmLoading: unref(createConfirmLoading),
    destroyOnClose: true,
  }))

  const createFormProps = computed<PlusFormProps>(() => ({
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

  function showCreate() {
    createVisible.value = true
  }

  async function confirmCreate(values: FieldValues) {
    try {
      createConfirmLoading.value = true

      await Apis.SystemDictData.create({
        data: {
          ...values,
          dictType: unref(dictType),
        },
      })

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
