import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import type { CreateSystemUserReqDto } from '~web/apis/globals'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
}

export function useCreate({ pageInstance, columns }: UseCreateParams) {
  const createVisible = ref(false)
  const createValues = ref<CreateSystemUserReqDto>({})
  const createConfirmLoading = ref(false)

  const createDialogProps = computed<PlusDialogProps>(() => ({
    title: t('system.user.dialog.create'),
    width: '900px',
    confirmLoading: unref(createConfirmLoading),
    destroyOnClose: true,
  }))

  const createFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    colProps: {
      span: 12,
    },
    columns: unref(columns),
    rules: {
      userName: [
        {
          required: true,
          message: t('common.validation.inputAccount'),
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: t('common.validation.inputPassword'),
          trigger: 'blur',
        },
      ],
      nickName: [
        {
          required: true,
          message: t('common.validation.inputNickname'),
          trigger: 'blur',
        },
      ],
      email: [
        {
          required: true,
          message: t('common.validation.inputEmail'),
          trigger: 'blur',
        },
      ],
      sex: [
        {
          required: true,
          message: t('common.validation.selectGender'),
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

  async function showCreate() {
    createVisible.value = true
  }

  async function confirmCreate(values: FieldValues) {
    try {
      createConfirmLoading.value = true

      await Apis.SystemUser.create({ data: values })

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
